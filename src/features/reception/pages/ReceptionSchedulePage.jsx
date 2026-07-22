import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CalendarPlus, ChevronDown, User, Phone, Stethoscope } from "lucide-react";

import CareLinkDatePicker from "../../../components/CareLinkDatePicker";
import AdminPageHeader from "../../admin/components/AdminPageHeader";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import {
  APPOINTMENT_STATUS_LABELS,
  CLINIC_TIME_SLOTS,
} from "../../care-system/data/careSystemStore";
import ReceptionBookModal from "../components/ReceptionBookModal";
import {
  statusBadgeClass,
  todayIso,
} from "../utils/receptionHelpers";
import apiClient from "../../../lib/api/client";

function ReceptionSchedulePage() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [scheduleDoctorId, setScheduleDoctorId] = useState("");
  const [scheduleDate, setScheduleDate] = useState(todayIso());
  const [daySchedule, setDaySchedule] = useState([]);
  const [bookForm, setBookForm] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const fetchData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        apiClient.get("/reception/patients"),
        apiClient.get("/reception/doctors")
      ]);
      
      const loadedPatients = patientsRes.data?.data || patientsRes.data || [];
      const loadedDoctors = doctorsRes.data?.data || doctorsRes.data || [];

      setPatients(loadedPatients);
      setDoctors(loadedDoctors);

      if (!scheduleDoctorId && loadedDoctors.length > 0) {
        setScheduleDoctorId(loadedDoctors[0].id);
      }
    } catch (error) {
      showToast("تعذر جلب بيانات الأساسية للنظام", "error");
    }
  };

  const fetchDoctorSchedule = async () => {
    if (!scheduleDoctorId || !scheduleDate) return;
    try {
      const response = await apiClient.get("/reception/doctor-schedule", {
        params: { doctor_id: scheduleDoctorId, date: scheduleDate }
      });
      setDaySchedule(response.data?.data || []);
    } catch (error) {
      setDaySchedule([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDoctorSchedule();
  }, [scheduleDoctorId, scheduleDate]);

  const freeSlots = useMemo(() => {
    const busyTimes = daySchedule.map((apt) => apt.time);
    return CLINIC_TIME_SLOTS.filter((slot) => !busyTimes.includes(slot));
  }, [daySchedule]);

  const timeline = useMemo(() => {
    const byTime = new Map(daySchedule.map((apt) => [apt.time, apt]));
    return CLINIC_TIME_SLOTS.map((slot) => ({
      time: slot,
      appointment: byTime.get(slot) || null,
      free: !byTime.has(slot),
    }));
  }, [daySchedule]);

  const selectedDoctor = doctors.find((d) => String(d.id) === String(scheduleDoctorId));

  const openBooking = (time = "") => {
    setBookForm({
      doctorId: scheduleDoctorId || doctors[0]?.id || "",
      date: scheduleDate || todayIso(),
      time,
      patientId: "",
      notes: "",
      type: "in_person"
    });
  };

  const updateAppointmentStatus = async (appointmentId, newStatus, successMsg) => {
    try {
      await apiClient.patch(`/reception/appointments/${appointmentId}/status`, {
        status: newStatus
      });
      showToast(successMsg, "success");
      fetchDoctorSchedule();
    } catch (error) {
      showToast(error.response?.data?.message || "تعذر تحديث حالة الموعد", "error");
    }
  };

  const transferToDoctor = async (apt) => {
    try {
      await apiClient.post(`/reception/appointments/${apt.id}/transfer`);
      showToast("تم تحويل المريض للطبيب", "success");
      fetchDoctorSchedule();
    } catch (error) {
      showToast("تعذر تحويل المريض", "error");
    }
  };

  const endVisitAtReception = async (apt) => {
    try {
      await apiClient.post(`/reception/appointments/${apt.id}/end`);
      showToast(`تم إنهاء زيارة ${apt.patient_name || apt.patient?.name}`, "success");
      fetchDoctorSchedule();
    } catch (error) {
      showToast("تعذر إنهاء الزيارة", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="ملف مواعيد الطبيب"
        description="اعرض جدول أي طبيب حسب اليوم، وشوف تفاصيل المريض والطبيب والأوقات المتاحة."
        action={
          <button
            type="button"
            onClick={() => openBooking()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer"
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
                className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.specialty ? `— ${d.specialty}` : ""}
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
              جدول الطبيب: <span className="font-extrabold text-[#101860]">{selectedDoctor.name}</span>
              {" · "}
              <span className="font-bold tabular-nums" dir="ltr" lang="en">
                {scheduleDate}
              </span>
            </p>
            <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
              {daySchedule.length} موعد محجوز
            </span>
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-100">
              {freeSlots.length} وقت متاح
            </span>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-500">
            <span className="w-16 shrink-0 text-center sm:w-20">الوقت</span>
            <span className="min-w-0 flex-1">تفاصيل الحجز والمريض</span>
            <span className="w-28 shrink-0 text-center sm:w-32">إجراءات الاستقبال</span>
          </div>

          <ul className="divide-y divide-slate-100">
            {timeline.map(({ time, appointment, free }) => (
              <li
                key={time}
                className={[
                  "flex items-center gap-4 px-4 py-3.5",
                  appointment ? "bg-white" : "bg-emerald-50/30",
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
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 font-extrabold text-slate-900 text-sm">
                          <User size={14} className="text-blue-600" />
                          {appointment.patient_name || appointment.patient?.name || appointment.patient}
                        </span>
                        
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusBadgeClass(appointment.status)}`}
                        >
                          {APPOINTMENT_STATUS_LABELS[appointment.status] || appointment.status}
                        </span>

                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {appointment.type === "in_person" ? "حضوري" : appointment.type || "حضوري"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        {appointment.patient?.phone && (
                          <span className="flex items-center gap-1" dir="ltr">
                            <Phone size={12} className="text-slate-400" />
                            {appointment.patient.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Stethoscope size={12} className="text-blue-500" />
                          الطبيب: <strong className="text-slate-700">{appointment.doctor_name || appointment.doctor?.name || selectedDoctor?.name}</strong>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-emerald-700">متاح للحجز في هذا الوقت</p>
                  )}
                </div>

                <div className="flex w-28 shrink-0 flex-wrap justify-center gap-1.5 sm:w-32">
                  {appointment ? (
                    <>
                      {(appointment.status === "scheduled" || appointment.status === "pending") && (
                        <button
                          type="button"
                          className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                          onClick={() => updateAppointmentStatus(appointment.id, "checked_in", "تم تسجيل الحضور")}
                        >
                          حضور
                        </button>
                      )}
                      {(appointment.status === "checked_in" ||
                        appointment.status === "scheduled" ||
                        appointment.status === "pending") && (
                        <button
                          type="button"
                          className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 hover:bg-blue-100 cursor-pointer"
                          onClick={() => transferToDoctor(appointment)}
                        >
                          تحويل
                        </button>
                      )}
                      {appointment.status !== "cancelled" &&
                        appointment.status !== "completed" && (
                          <button
                            type="button"
                            className="workspace-btn-press rounded-lg bg-rose-50 px-2.5 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                            onClick={() => updateAppointmentStatus(appointment.id, "cancelled", "تم إلغاء الموعد")}
                          >
                            إلغاء
                          </button>
                        )}
                      {["with_doctor", "awaiting_lab", "awaiting_radiology", "results_ready", "awaiting_pharmacy", "checked_in"].includes(
                        appointment.status
                      ) && (
                        <button
                          type="button"
                          className="workspace-btn-press rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800 cursor-pointer"
                          onClick={() => endVisitAtReception(appointment)}
                        >
                          إنهاء
                        </button>
                      )}
                    </>
                  ) : free ? (
                    <button
                      type="button"
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700 cursor-pointer"
                      onClick={() => openBooking(time)}
                    >
                      حجز موعد
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
          key={`${bookForm.doctorId}-${bookForm.date}-${bookForm.time}`}
          patients={patients}
          doctors={doctors}
          initialForm={bookForm}
          onClose={() => setBookForm(null)}
          onSuccess={(saved) => {
            showToast("تم إنشاء الموعد بنجاح", "success");
            setScheduleDoctorId(saved.doctor_id || saved.doctorId);
            setScheduleDate(saved.date || scheduleDate);
            setBookForm(null);
            fetchDoctorSchedule();
          }}
          onError={(message) => showToast(message, "error")}
        />
      )}
    </div>
  );
}

export default ReceptionSchedulePage;