import { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  PackageCheck,
  Pill,
  Search,
  UserRound,
} from "lucide-react";

import AdminPageHeader from "../../admin/components/AdminPageHeader";
import EmptyState from "../../admin/components/EmptyState";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { useAuth } from "../../authentication/context/AuthContext";
import { careSystemStore } from "../../care-system/data/careSystemStore";
import DispenseVerifyModal from "../components/DispenseVerifyModal";

const STATUS_FILTERS = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "بانتظار التجهيز" },
  { value: "ready", label: "جاهز للاستلام" },
  { value: "dispensed", label: "تم الصرف" },
];

function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function matchesPrescriptionQuery(rx, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const digitsQ = normalizeDigits(q);
  const phoneDigits = normalizeDigits(rx.phone);
  const nationalDigits = normalizeDigits(rx.nationalId);
  const haystack = `${rx.patient} ${rx.doctor} ${rx.medications} ${rx.nationalId} ${rx.phone}`
    .toLowerCase()
    .replace(/\s+/g, " ");

  const tokens = q.split(/\s+/).filter(Boolean);
  const textMatch = tokens.every((token) => haystack.includes(token));
  const phoneMatch = digitsQ.length >= 3 && phoneDigits.includes(digitsQ);
  const idMatch = digitsQ.length >= 3 && nationalDigits.includes(digitsQ);

  return textMatch || phoneMatch || idMatch;
}

function PharmacyPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [query, setQuery] = useState("");
  const [dispenseTarget, setDispenseTarget] = useState(null);
  const { toast, showToast, hideToast } = useToast();
  const { profile } = useAuth();

  const reload = () => {
    const { patientName, doctorName } = careSystemStore.resolveNames();
    setPrescriptions(
      careSystemStore.listPrescriptions().map((rx) => {
        const patient = careSystemStore.getPatient(rx.patientId);
        return {
          ...rx,
          patient:
            rx.patientName ||
            patientName(rx.patientId) ||
            patient?.name ||
            "مريض غير معروف",
          doctor: doctorName(rx.doctorId),
          phone: rx.patientPhone || patient?.phone || "",
          nationalId: rx.nationalId || patient?.nationalId || "",
        };
      })
    );
  };

  useEffect(() => {
    reload();
    const onStorage = (event) => {
      if (event.key === "carelink_care_system_v2" || event.key === null) reload();
    };
    let channel;
    try {
      channel = new BroadcastChannel("carelink-store");
      channel.onmessage = () => reload();
    } catch {
      channel = null;
    }
    window.addEventListener("carelink-store-updated", reload);
    window.addEventListener("storage", onStorage);
    const timer = window.setInterval(reload, 2500);
    return () => {
      window.removeEventListener("carelink-store-updated", reload);
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
      try {
        channel?.close();
      } catch {
        // ignore
      }
    };
  }, []);

  const doctorOptions = useMemo(() => {
    const map = new Map();
    prescriptions.forEach((rx) => {
      if (rx.doctorId) map.set(rx.doctorId, rx.doctor);
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [prescriptions]);

  const filtered = useMemo(() => {
    return prescriptions.filter((rx) => {
      if (!matchesPrescriptionQuery(rx, query)) return false;
      if (filter === "pending" && rx.status !== "pending" && rx.status) {
        // pending القديم أو بدون status قديم
        if (rx.status === "ready" || rx.status === "dispensed") return false;
      }
      if (filter === "ready" && rx.status !== "ready") return false;
      if (filter === "dispensed" && rx.status !== "dispensed") return false;
      if (doctorFilter !== "all" && rx.doctorId !== doctorFilter) return false;
      if (dateFilter) {
        const created = (rx.createdAt || rx.dispensedAt || "").slice(0, 10);
        if (created !== dateFilter) return false;
      }
      return true;
    });
  }, [prescriptions, filter, query, doctorFilter, dateFilter]);

  return (
    <div className="space-y-6" dir="rtl">
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="الوصفات"
        description="ابحث وفلتر حسب الحالة أو الطبيب أو التاريخ — الصرف يتطلب التحقق من هوية المريض."
      />

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex w-full flex-wrap gap-2">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                filter === item.value
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200/60"
                  : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 sm:col-span-1">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input
              className="h-11 w-full bg-transparent text-sm outline-none"
              placeholder="اسم / جوال / هوية..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="all">كل الأطباء</option>
            {doctorOptions.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-400"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <p className="text-xs font-semibold text-slate-500">
          النتائج: {filtered.length} وصفة
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="لا توجد وصفات مطابقة"
          description="غيّر الفلتر أو البحث، أو انتظر وصفة جديدة من الطبيب."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((rx) => {
            const allergy = careSystemStore.findAllergyConflict(
              careSystemStore.getMedicalProfile(rx.patientId)?.allergies,
              rx.medications
            );

            return (
              <article
                key={rx.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <UserRound size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-extrabold text-blue-950">
                        {rx.patient}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                        {rx.phone ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                            الجوال:
                            <span dir="ltr" className="font-bold tabular-nums text-blue-800">
                              {rx.phone}
                            </span>
                          </span>
                        ) : (
                          <span className="rounded-lg bg-amber-50 px-2 py-1 text-amber-700">
                            لا يوجد رقم جوال
                          </span>
                        )}
                        {rx.nationalId ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1">
                            الهوية:
                            <span dir="ltr" className="font-bold tabular-nums">
                              {rx.nationalId}
                            </span>
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        الطبيب: {rx.doctor}
                      </p>
                    </div>
                  </div>

                  {rx.status === "dispensed" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                      <CheckCircle2 size={12} />
                      تم الصرف
                    </span>
                  ) : rx.status === "ready" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
                      <BellRing size={12} />
                      جاهز للاستلام
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                      بانتظار التجهيز
                    </span>
                  )}
                </div>

                {allergy && rx.status !== "dispensed" ? (
                  <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                    تنبيه حساسية محتمل: {allergy}
                  </div>
                ) : null}

                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-3">
                  <p className="mb-1 text-[11px] font-extrabold text-slate-500">الأدوية والجرعات</p>
                  <p className="whitespace-pre-line text-sm font-semibold leading-6 text-slate-800">
                    {rx.medications}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold text-slate-400">
                    {rx.createdAt
                      ? `أُرسلت ${new Date(rx.createdAt).toLocaleString("ar")}`
                      : "وصفة من الطبيب"}
                  </p>
                  {rx.status !== "dispensed" ? (
                    <div className="flex flex-wrap gap-2">
                      {rx.status !== "ready" ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                          onClick={() => {
                            try {
                              careSystemStore.markPrescriptionReady(rx.id, {
                                pharmacistName: profile?.name || "الصيدلي",
                              });
                              showToast(
                                `تم إشعار ${rx.patient}: الدواء جاهز للاستلام`,
                                "success"
                              );
                              reload();
                            } catch (error) {
                              showToast(error.message || "تعذر التجهيز", "error");
                            }
                          }}
                        >
                          <BellRing size={16} />
                          جاهز — إشعار المريض
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                        onClick={() => setDispenseTarget(rx)}
                      >
                        <PackageCheck size={16} />
                        صرف الدواء للمريض
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700">
                      صُرف {rx.dispensedAt ? new Date(rx.dispensedAt).toLocaleString("ar") : ""}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {dispenseTarget ? (
        <DispenseVerifyModal
          prescription={dispenseTarget}
          onClose={() => setDispenseTarget(null)}
          onSuccess={(rx) => {
            showToast(`تم صرف دواء ${rx.patient || rx.patientName}`, "success");
            reload();
          }}
        />
      ) : null}
    </div>
  );
}

export default PharmacyPrescriptionsPage;
