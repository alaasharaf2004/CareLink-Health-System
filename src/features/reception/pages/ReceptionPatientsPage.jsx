import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, Flag, Search, UserPlus } from "lucide-react";

import AdminPageHeader from "../../admin/components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";
import ReceptionBookModal from "../components/ReceptionBookModal";
import ReceptionPatientMetaModal from "../components/ReceptionPatientMetaModal";
import ReceptionRegisterPatientModal from "../components/ReceptionRegisterPatientModal";
import useReceptionShortcuts from "../hooks/useReceptionShortcuts";
import {
  emptyAppointmentForm,
  flagMeta,
  insuranceMeta,
  todayIso,
} from "../utils/receptionHelpers";

function ReceptionPatientsPage() {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [bookForm, setBookForm] = useState(null);
  const [metaPatient, setMetaPatient] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const reload = () => {
    setPatients(careSystemStore.listPatients());
    setDoctors(careSystemStore.listStaff("doctor").filter((d) => d.status === "active"));
  };

  useEffect(() => {
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  const openRegister = useCallback(() => setRegisterOpen(true), []);
  useReceptionShortcuts({ onRegister: openRegister });

  const filteredPatients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      `${p.name} ${p.phone} ${p.email} ${p.nationalId} ${p.insuranceProvider || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [patients, query]);

  const openBooking = (patientId = "") => {
    setBookForm(
      emptyAppointmentForm({
        patientId,
        doctorId: doctors[0]?.id || "",
        date: todayIso(),
      })
    );
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="ملف المرضى"
        description="بحث، تسجيل تابع لعائلة، تأمين، وتنبيهات استقبال. Ctrl+N لتسجيل مريض جديد."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openRegister}
              className="workspace-btn-press flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              <UserPlus size={16} />
              تسجيل مريض
            </button>
            <button
              type="button"
              onClick={() => openBooking()}
              className="workspace-btn-press flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100"
            >
              <CalendarPlus size={16} />
              حجز موعد
            </button>
          </div>
        }
      />

      <section className="patient-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input
              className="h-11 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              placeholder="ابحث بالاسم أو الجوال أو الهوية أو شركة التأمين..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <AdminTable
          bordered={false}
          columns={[
            { key: "name", label: "المريض" },
            { key: "phone", label: "الجوال" },
            { key: "insurance", label: "التأمين" },
            { key: "flags", label: "تنبيهات" },
            { key: "actions", label: "إجراء" },
          ]}
        >
          {filteredPatients.length === 0 ? (
            <AdminTableRow>
              <AdminTableCell colSpan={5} className="text-center text-slate-500">
                لا يوجد مرضى مطابقون — سجّل مريضاً جديداً
              </AdminTableCell>
            </AdminTableRow>
          ) : (
            filteredPatients.map((patient) => {
              const insurance = insuranceMeta(patient.insuranceStatus);
              const guardian = patient.guardianId
                ? careSystemStore.getPatient(patient.guardianId)
                : null;
              const dependents = careSystemStore.listDependents(patient.id);
              return (
                <AdminTableRow key={patient.id} className="workspace-list-row">
                  <AdminTableCell>
                    <p className="font-bold text-[#101860]">{patient.name}</p>
                    {guardian ? (
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                        تابع لـ {guardian.name}
                      </p>
                    ) : null}
                    {dependents.length > 0 ? (
                      <p className="mt-0.5 text-[11px] font-semibold text-blue-600">
                        {dependents.length} تابع/تابعين
                      </p>
                    ) : null}
                  </AdminTableCell>
                  <AdminTableCell>
                    <span dir="ltr" lang="en" className="inline-block tabular-nums">
                      {patient.phone || "—"}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${insurance.className}`}
                    >
                      {insurance.label}
                    </span>
                    {patient.insuranceProvider ? (
                      <p className="mt-1 text-[11px] text-slate-400">{patient.insuranceProvider}</p>
                    ) : null}
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="flex flex-wrap gap-1">
                      {(patient.receptionFlags || []).length === 0 ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : (
                        (patient.receptionFlags || []).map((flag) => {
                          const meta = flagMeta(flag);
                          return (
                            <span
                              key={flag}
                              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${meta.className}`}
                            >
                              {meta.label}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="workspace-btn-press rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                        onClick={() => openBooking(patient.id)}
                      >
                        حجز موعد
                      </button>
                      <button
                        type="button"
                        className="workspace-btn-press inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
                        onClick={() => setMetaPatient(patient)}
                      >
                        <Flag size={12} />
                        تنبيه/تأمين
                      </button>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })
          )}
        </AdminTable>
      </section>

      {registerOpen && (
        <ReceptionRegisterPatientModal
          patients={patients}
          onClose={() => setRegisterOpen(false)}
          onSuccess={(created, form) => {
            showToast(
              form.createWebAccount && form.email
                ? "تم تسجيل المريض وإنشاء حساب الويب"
                : "تم تسجيل المريض",
              "success"
            );
            setRegisterOpen(false);
            if (created?.id) openBooking(created.id);
          }}
          onError={(message) => showToast(message, "error")}
        />
      )}

      {bookForm && (
        <ReceptionBookModal
          key={`${bookForm.patientId}-${bookForm.doctorId}`}
          patients={patients}
          doctors={doctors}
          initialForm={bookForm}
          onClose={() => setBookForm(null)}
          onSuccess={() => {
            showToast("تم إنشاء الموعد", "success");
            setBookForm(null);
          }}
          onError={(message) => showToast(message, "error")}
        />
      )}

      {metaPatient ? (
        <ReceptionPatientMetaModal
          patient={metaPatient}
          patients={patients}
          onClose={() => setMetaPatient(null)}
          onSaved={() => {
            showToast("تم تحديث تنبيهات/تأمين المريض", "success");
            setMetaPatient(null);
          }}
          onError={(message) => showToast(message, "error")}
        />
      ) : null}
    </div>
  );
}

export default ReceptionPatientsPage;
