import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MonitorPlay,
  Users,
  UserPlus,
} from "lucide-react";

import AdminPageHeader from "../../admin/components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { useAuth } from "../../authentication/context/AuthContext";
import {
  APPOINTMENT_STATUS_LABELS,
} from "../../care-system/data/careSystemStore";
import FadeUp from "../../patient/components/FadeUp";
import { staggerDelay } from "../../patient/utils/staggerDelay";
import ReceptionBookModal from "../components/ReceptionBookModal";
import ReceptionDaySummaryModal from "../components/ReceptionDaySummaryModal";
import ReceptionHandoverPanel from "../components/ReceptionHandoverPanel";
import ReceptionRegisterPatientModal from "../components/ReceptionRegisterPatientModal";
import useReceptionShortcuts from "../hooks/useReceptionShortcuts";
import {
  emptyAppointmentForm,
  flagMeta,
  insuranceMeta,
  statusBadgeClass,
  todayIso,
} from "../utils/receptionHelpers";
import apiClient from "../../../lib/api/client";

function ReceptionHomePage() {
  const { profile } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [bookForm, setBookForm] = useState(null);
  const [daySummary, setDaySummary] = useState(null);
  const { toast, showToast, hideToast } = useToast();
  const today = todayIso();

  // جلب البيانات من الـ Backend
  const reload = async () => {
    try {
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
        apiClient.get("/reception/patients"),
        apiClient.get("/reception/doctors"),
        apiClient.get("/reception/appointments/all", { params: { date: today } })
      ]);

      const loadedPatients = patientsRes.data?.data || patientsRes.data || [];
      const loadedDoctors = doctorsRes.data?.data || doctorsRes.data || [];
      const loadedAppointments = appointmentsRes.data?.data || appointmentsRes.data || [];

      setPatients(loadedPatients);
      setDoctors(loadedDoctors.filter((d) => d.status === 1 || d.status === "active"));
      
      // تنسيق المواعيد لتتوافق مع هيكلة الجدول
      const formattedAppointments = loadedAppointments.map((apt) => ({
        id: apt.id,
        date: apt.scheduled_at ? apt.scheduled_at.split(' ')[0] : today,
        time: apt.scheduled_at ? new Date(apt.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '',
        patientId: apt.patient_id,
        doctorId: apt.doctor_id,
        patient: apt.patient?.full_name || apt.patient?.name || 'مريض',
        doctor: apt.doctor?.name || 'طبيب',
        status: apt.status,
        type: apt.type,
        patientRecord: apt.patient,
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      showToast("تعذر جلب بيانات لوحة الاستقبال", "error");
    }
  };

  useEffect(() => {
    reload();
  }, [today]);

  const openRegister = useCallback(() => setRegisterOpen(true), []);
  const openDaySummary = useCallback(() => {
    // ملخص مبدئي لليوم بناءً على المواعيد الحالية
    setDaySummary({
      date: today,
      totalAppointments: appointments.length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
    });
  }, [today, appointments]);

  const openWaitingDisplay = useCallback(() => {
    window.open("/reception/waiting-display", "_blank", "noopener,noreferrer");
  }, []);

  useReceptionShortcuts({
    onRegister: openRegister,
    onDaySummary: openDaySummary,
    onWaitingDisplay: openWaitingDisplay,
  });

  const todayAppointments = useMemo(
    () =>
      appointments
        .filter((apt) => apt.status !== "cancelled")
        .sort((a, b) => String(a.time).localeCompare(String(b.time))),
    [appointments]
  );

  const waitingCount = todayAppointments.filter((apt) =>
    ["pending", "scheduled", "checked_in"].includes(apt.status)
  ).length;
  const withDoctorCount = todayAppointments.filter((apt) => apt.status === "with_doctor").length;

  const updateAppointmentStatus = async (appointmentId, newStatus, successMsg) => {
    try {
      await apiClient.patch(`/reception/appointments/${appointmentId}/status`, {
        status: newStatus
      });
      showToast(successMsg, "success");
      reload();
    } catch (error) {
      showToast(error.response?.data?.message || "تعذر تحديث الحالة", "error");
    }
  };

  const transferToDoctor = async (apt) => {
    try {
      await apiClient.post(`/reception/appointments/${apt.id}/transfer`);
      showToast("تم تحويل المريض للطبيب", "success");
      reload();
    } catch (error) {
      showToast("تعذر تحويل المريض", "error");
    }
  };

  const endVisitAtReception = async (apt) => {
    try {
      await apiClient.post(`/reception/appointments/${apt.id}/end`);
      showToast(`تم إنهاء زيارة ${apt.patient}`, "success");
      reload();
    } catch (error) {
      showToast("تعذر إنهاء الزيارة", "error");
    }
  };

  const canEndVisit = (status) =>
    [
      "with_doctor",
      "awaiting_lab",
      "awaiting_radiology",
      "results_ready",
      "awaiting_pharmacy",
      "checked_in",
    ].includes(status);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <FadeUp index={0}>
        <AdminPageHeader
          title="لوحة الاستقبال"
          description="طابور اليوم + تأمين وتنبيهات + تسليم وردية. اختصارات: Ctrl+N تسجيل · Ctrl+Shift+S ملخص · Ctrl+Shift+W شاشة انتظار"
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openRegister}
                className="workspace-btn-press flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                <UserPlus size={16} />
                تسجيل مريض
                <kbd className="hidden rounded bg-white/20 px-1.5 py-0.5 text-[10px] sm:inline">
                  Ctrl+N
                </kbd>
              </button>
              <button
                type="button"
                onClick={openDaySummary}
                className="workspace-btn-press flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <BarChart3 size={16} />
                ملخص اليوم
              </button>
              <button
                type="button"
                onClick={openWaitingDisplay}
                className="workspace-btn-press flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-100 cursor-pointer"
              >
                <MonitorPlay size={16} />
                شاشة الانتظار
              </button>
              <Link
                to="/reception/schedule"
                className="workspace-btn-press flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100"
              >
                <CalendarDays size={16} />
                جدول الأطباء
              </Link>
            </div>
          }
        />
      </FadeUp>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "مواعيد اليوم",
            value: todayAppointments.length,
            icon: CalendarClock,
            className: "border-slate-200 bg-white",
            valueClass: "text-[#101860]",
            iconClass: "text-blue-600",
            labelClass: "text-slate-500",
          },
          {
            label: "بانتظار / حضور",
            value: waitingCount,
            icon: Clock3,
            className: "border-amber-100 bg-amber-50/70",
            valueClass: "text-amber-800",
            iconClass: "text-amber-600",
            labelClass: "text-amber-700",
          },
          {
            label: "عند الطبيب",
            value: withDoctorCount,
            icon: CheckCircle2,
            className: "border-blue-100 bg-blue-50/70",
            valueClass: "text-blue-900",
            iconClass: "text-blue-600",
            labelClass: "text-blue-700",
          },
          {
            label: "المرضى المسجّلون",
            value: patients.length,
            icon: Users,
            className: "border-teal-100 bg-teal-50/50",
            valueClass: "text-teal-900",
            iconClass: "text-teal-600",
            labelClass: "text-teal-700",
          },
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`workspace-stat-chip workspace-quick-tile rounded-2xl border p-4 shadow-sm opacity-0 animate-[formFadeUp_0.5s_ease_forwards] ${card.className}`}
              style={{ animationDelay: staggerDelay(index, 0.06, 0.08) }}
            >
              <div className="flex items-center justify-between">
                <p className={`text-xs font-bold ${card.labelClass}`}>{card.label}</p>
                <Icon size={18} className={card.iconClass} />
              </div>
              <p className={`mt-3 text-3xl font-black ${card.valueClass}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <FadeUp index={2} className="xl:col-span-3">
          <section className="patient-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <h2 className="text-base font-extrabold text-[#101860]">طابور مواعيد اليوم</h2>
              <p className="text-xs font-semibold tabular-nums text-slate-500" dir="ltr" lang="en">
                {today}
              </p>
            </div>

            <AdminTable
              bordered={false}
              columns={[
                { key: "time", label: "الوقت" },
                { key: "patient", label: "المريض" },
                { key: "doctor", label: "الطبيب" },
                { key: "status", label: "الحالة" },
                { key: "actions", label: "إجراء" },
              ]}
            >
              {todayAppointments.length === 0 ? (
                <AdminTableRow>
                  <AdminTableCell colSpan={5} className="text-center text-slate-500">
                    لا مواعيد لليوم — افتح{" "}
                    <Link
                      to="/reception/schedule"
                      className="font-bold text-blue-600 hover:underline"
                    >
                      ملف مواعيد الطبيب
                    </Link>{" "}
                    للحجز
                  </AdminTableCell>
                </AdminTableRow>
              ) : (
                todayAppointments.map((apt) => {
                  const patient = apt.patientRecord;
                  const insurance = insuranceMeta(patient?.insuranceStatus);
                  const flags = patient?.receptionFlags || [];
                  return (
                    <AdminTableRow key={apt.id} className="workspace-list-row">
                      <AdminTableCell>
                        <span
                          dir="ltr"
                          lang="en"
                          className="inline-block font-extrabold tabular-nums text-[#101860]"
                        >
                          {apt.time}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <p className="font-bold text-slate-800">{apt.patient}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${insurance.className}`}
                          >
                            {insurance.label}
                          </span>
                          {flags.map((flag) => {
                            const meta = flagMeta(flag);
                            return (
                              <span
                                key={flag}
                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${meta.className}`}
                                title={patient?.receptionNote || meta.label}
                              >
                                {meta.label}
                              </span>
                            );
                          })}
                        </div>
                        {patient?.receptionNote ? (
                          <p className="mt-1 max-w-[14rem] truncate text-[11px] text-slate-400">
                            {patient.receptionNote}
                          </p>
                        ) : null}
                      </AdminTableCell>
                      <AdminTableCell>{apt.doctor}</AdminTableCell>
                      <AdminTableCell>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusBadgeClass(apt.status)}`}
                        >
                          {APPOINTMENT_STATUS_LABELS[apt.status] || apt.status}
                        </span>
                      </AdminTableCell>
                      <AdminTableCell>
                        <div className="flex flex-wrap gap-2">
                          {(apt.status === "scheduled" || apt.status === "pending") && (
                            <button
                              type="button"
                              className="workspace-btn-press rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                              onClick={() => updateAppointmentStatus(apt.id, "checked_in", "تم تسجيل الحضور")}
                            >
                              تسجيل حضور
                            </button>
                          )}
                          {(apt.status === "checked_in" || apt.status === "scheduled" || apt.status === "pending") && (
                            <button
                              type="button"
                              className="workspace-btn-press rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                              onClick={() => transferToDoctor(apt)}
                            >
                              تحويل للطبيب
                            </button>
                          )}
                          {canEndVisit(apt.status) && (
                            <button
                              type="button"
                              className="workspace-btn-press rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                              onClick={() => endVisitAtReception(apt)}
                            >
                              إنهاء زيارة
                            </button>
                          )}
                          {apt.status !== "cancelled" && apt.status !== "completed" && (
                            <button
                              type="button"
                              className="workspace-btn-press rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                              onClick={() => updateAppointmentStatus(apt.id, "cancelled", "تم إلغاء الموعد")}
                            >
                              إلغاء
                            </button>
                          )}
                        </div>
                      </AdminTableCell>
                    </AdminTableRow>
                  );
                })
              )}
            </AdminTable>
          </section>
        </FadeUp>

        <FadeUp index={3} className="xl:col-span-2">
          <ReceptionHandoverPanel authorName={profile?.name || "الاستقبال"} />
        </FadeUp>
      </div>

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
            reload();
            if (created?.id) {
              setBookForm(
                emptyAppointmentForm({
                  patientId: created.id,
                  doctorId: doctors[0]?.id || "",
                })
              );
            }
          }}
          onError={(message) => showToast(message, "error")}
        />
      )}

      {bookForm && (
        <ReceptionBookModal
          key={bookForm.patientId}
          patients={patients}
          doctors={doctors}
          initialForm={bookForm}
          onClose={() => setBookForm(null)}
          onSuccess={() => {
            showToast("تم إنشاء الموعد بنجاح", "success");
            setBookForm(null);
            reload();
          }}
          onError={(message) => showToast(message, "error")}
        />
      )}

      {daySummary ? (
        <ReceptionDaySummaryModal summary={daySummary} onClose={() => setDaySummary(null)} />
      ) : null}
    </div>
  );
}

export default ReceptionHomePage;