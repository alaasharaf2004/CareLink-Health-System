import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CalendarPlus, ChevronDown } from "lucide-react";

import CareLinkDatePicker from "../../../components/CareLinkDatePicker";
import AdminPageHeader from "../../admin/components/AdminPageHeader";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import {
  APPOINTMENT_STATUS_LABELS,
  CLINIC_TIME_SLOTS,
  careSystemStore,
} from "../../care-system/data/careSystemStore";
import ReceptionBookModal from "../components/ReceptionBookModal";
import {
  emptyAppointmentForm,
  statusBadgeClass,
  todayIso,
} from "../utils/receptionHelpers";

function ReceptionSchedulePage() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [scheduleDoctorId, setScheduleDoctorId] = useState("");
  const [scheduleDate, setScheduleDate] = useState(todayIso());
  const [tick, setTick] = useState(0);
  const [bookForm, setBookForm] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const reload = () => {
    setPatients(careSystemStore.listPatients());
    const activeDoctors = careSystemStore.listStaff("doctor").filter((d) => d.status === "active");
    setDoctors(activeDoctors);
    setScheduleDoctorId((current) => current || activeDoctors[0]?.id || "");
    setTick((n) => n + 1);
  };

  useEffect(() => {
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  const daySchedule = useMemo(() => {
    if (!scheduleDoctorId || !scheduleDate) return [];
    return careSystemStore.getDoctorDaySchedule(scheduleDoctorId, scheduleDate);
  }, [scheduleDoctorId, scheduleDate, tick]);

  const freeSlots = useMemo(() => {
    if (!scheduleDoctorId || !scheduleDate) return [];
    return careSystemStore.getAvailableSlots(scheduleDoctorId, scheduleDate);
  }, [scheduleDoctorId, scheduleDate, tick]);

  const timeline = useMemo(() => {
    const byTime = new Map(daySchedule.map((apt) => [apt.time, apt]));
    return CLINIC_TIME_SLOTS.map((slot) => ({
      time: slot,
      appointment: byTime.get(slot) || null,
      free: freeSlots.includes(slot),
    }));
  }, [daySchedule, freeSlots]);

  const selectedDoctor = doctors.find((d) => d.id === scheduleDoctorId);

  const openBooking = (time = "") => {
    setBookForm(
      emptyAppointmentForm({
        doctorId: scheduleDoctorId || doctors[0]?.id || "",
        date: scheduleDate || todayIso(),
        time,
      })
    );
  };

  const transferToDoctor = (apt) => {
    careSystemStore.setAppointmentStatus(apt.id, "with_doctor");
    careSystemStore.upsertVisit({
      appointmentId: apt.id,
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      status: "with_doctor",
      diagnosis: "",
      clinicalNotes: "",
    });
    showToast("تم تحويل المريض للطبيب", "success");
  };

  const endVisitAtReception = (apt) => {
    careSystemStore.setAppointmentStatus(apt.id, "completed");
    careSystemStore.upsertVisit({
      appointmentId: apt.id,
      patientId: apt.patientId,
      doctorId: apt.doctorId,
      status: "completed",
      endedAt: new Date().toISOString(),
    });
    if (apt.patientId) {
      careSystemStore.notifyPatient({
        patientId: apt.patientId,
        title: "انتهت زيارتك",
        body: "أنهى الاستقبال زيارتك في العيادة. شكرًا لزيارتك CareLink.",
        type: "visit",
      });
    }
    showToast(`تم إنهاء زيارة ${apt.patient}`, "success");
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="ملف مواعيد الطبيب"
        description="اعرض جدول أي طبيب حسب اليوم، وشوف المرضى المحجوزين والأوقات المتاحة، واحجز للمريض القادم."
        action={
          <button
            type="button"
            onClick={() => openBooking()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <CalendarPlus size={16} />
            حجز موعد
          </button>
        }
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-600">الطبيب</span>
            <div className="carelink-field">
              <select
                value={scheduleDoctorId}
                onChange={(e) => setScheduleDoctorId(e.target.value)}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="carelink-field-icon" aria-hidden="true" />
            </div>
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-600">اليوم</span>
            <CareLinkDatePicker value={scheduleDate} onChange={setScheduleDate} required />
          </label>
        </div>

        {selectedDoctor && (
          <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <CalendarDays size={18} className="text-blue-600" />
            <p className="text-sm text-slate-600">
              جدول <span className="font-extrabold text-[#101860]">{selectedDoctor.name}</span>
              {" · "}
              <span className="font-bold tabular-nums" dir="ltr" lang="en">
                {scheduleDate}
              </span>
            </p>
            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
              {daySchedule.length} محجوز
            </span>
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">
              {freeSlots.length} متاح
            </span>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-500">
            <span className="w-16 shrink-0 text-center sm:w-20">الوقت</span>
            <span className="min-w-0 flex-1">الحالة</span>
            <span className="w-24 shrink-0 text-center sm:w-28">إجراء</span>
          </div>

          <ul className="divide-y divide-slate-100">
            {timeline.map(({ time, appointment, free }) => (
              <li
                key={time}
                className={[
                  "flex items-center gap-4 px-4 py-3",
                  appointment ? "bg-white" : "bg-emerald-50/40",
                ].join(" ")}
              >
                <div className="w-16 shrink-0 text-center sm:w-20">
                  <p
                    className="text-base font-extrabold tabular-nums leading-none text-[#101860] sm:text-lg"
                    dir="ltr"
                    lang="en"
                  >
                    {time}
                  </p>
                </div>

                <div className="min-w-0 flex-1">
                  {appointment ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-bold text-slate-800">{appointment.patient}</p>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusBadgeClass(appointment.status)}`}
                      >
                        {APPOINTMENT_STATUS_LABELS[appointment.status]}
                      </span>
                      <span className="text-xs text-slate-400">{appointment.type || "حضوري"}</span>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-emerald-700">متاح للحجز</p>
                  )}
                </div>

                <div className="flex w-24 shrink-0 flex-wrap justify-center gap-1.5 sm:w-28">
                  {appointment ? (
                    <>
                      {appointment.status === "scheduled" && (
                        <button
                          type="button"
                          className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                          onClick={() => {
                            careSystemStore.setAppointmentStatus(appointment.id, "checked_in");
                            showToast("تم تسجيل الحضور", "success");
                          }}
                        >
                          حضور
                        </button>
                      )}
                      {(appointment.status === "checked_in" ||
                        appointment.status === "scheduled") && (
                        <button
                          type="button"
                          className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                          onClick={() => transferToDoctor(appointment)}
                        >
                          تحويل
                        </button>
                      )}
                      {appointment.status !== "cancelled" &&
                        appointment.status !== "completed" && (
                          <button
                            type="button"
                            className="workspace-btn-press rounded-lg bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                            onClick={() => {
                              careSystemStore.setAppointmentStatus(appointment.id, "cancelled");
                              showToast("تم إلغاء الموعد", "error");
                            }}
                          >
                            إلغاء
                          </button>
                        )}
                      {["with_doctor", "awaiting_lab", "awaiting_radiology", "results_ready", "awaiting_pharmacy", "checked_in"].includes(
                        appointment.status
                      ) && (
                        <button
                          type="button"
                          className="workspace-btn-press rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800"
                          onClick={() => endVisitAtReception(appointment)}
                        >
                          إنهاء
                        </button>
                      )}
                    </>
                  ) : free ? (
                    <button
                      type="button"
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700"
                      onClick={() => openBooking(time)}
                    >
                      حجز
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {bookForm && (
        <ReceptionBookModal
          key={`${bookForm.doctorId}-${bookForm.date}-${bookForm.time}-${bookForm.patientId}`}
          patients={patients}
          doctors={doctors}
          initialForm={bookForm}
          onClose={() => setBookForm(null)}
          onSuccess={(saved) => {
            showToast("تم إنشاء الموعد", "success");
            setScheduleDoctorId(saved.doctorId);
            setScheduleDate(saved.date);
            setBookForm(null);
          }}
          onError={(message) => showToast(message, "error")}
        />
      )}
    </div>
  );
}

export default ReceptionSchedulePage;
