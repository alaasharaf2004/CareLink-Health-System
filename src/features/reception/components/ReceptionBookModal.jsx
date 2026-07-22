import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import CareLinkDatePicker from "../../../components/CareLinkDatePicker";
import Modal from "../../admin/components/Modal";
import { emptyAppointmentForm } from "../utils/receptionHelpers";
import apiClient from "../../../lib/api/client";

// الأوقات المتاحة الثابتة للعيادة (يمكنك جلبها من الـ backend أو تركها هنا)
const CLINIC_TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM"
];

function ReceptionBookModal({
  patients,
  doctors,
  initialForm,
  onClose,
  onSuccess,
  onError,
}) {
  const [form, setForm] = useState(() => emptyAppointmentForm(initialForm));
  const [busySlots, setBusySlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // جلب المواعيد المحجوزة للطبيب في اليوم المحدد من الـ Backend
  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (!form.doctorId || !form.date) {
        setBusySlots([]);
        return;
      }
      try {
        const response = await apiClient.get(`/reception/doctor-schedule`, {
          params: { doctor_id: form.doctorId, date: form.date }
        });
        setBusySlots(response.data?.data || []);
      } catch (err) {
        setBusySlots([]);
      }
    };

    fetchDoctorSchedule();
  }, [form.doctorId, form.date]);

  // الأوقات المشغولة كنص أو أري لتسهيل الفحص
  const busyTimes = busySlots.map((apt) => apt.time);

  const saveAppointment = async (event) => {
    event.preventDefault();
    if (!form.time) {
      onError?.("اختر وقتاً فارغاً من جدول الطبيب");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post("/reception/appointments", {
        patient_id: form.patientId,
        doctor_id: form.doctorId,
        date: form.date,
        time: form.time,
        notes: form.notes || "",
        type: form.type || "in_person",
      });

      onSuccess?.(response.data?.data || response.data);
    } catch (error) {
      onError?.(error.response?.data?.message || "تعذر إنشاء الموعد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="حجز موعد للمريض" onClose={onClose} maxWidth="max-w-2xl">
      <form className="space-y-4" onSubmit={saveAppointment} dir="rtl">
        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-slate-600">المريض</span>
          <div className="carelink-field">
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              required
              className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 bg-white"
            >
              <option value="">اختر المريض</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name}
                  {p.phone ? ` — ${p.phone}` : ""}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="carelink-field-icon" aria-hidden="true" />
          </div>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-600">الطبيب</span>
            <div className="carelink-field">
              <select
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value, time: "" })}
                required
                className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 bg-white"
              >
                <option value="">اختر الطبيب</option>
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
            <CareLinkDatePicker
              value={form.date}
              onChange={(date) => setForm({ ...form, date, time: "" })}
              required
            />
          </label>
        </div>

        {form.doctorId && form.date && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-bold text-slate-600">
              مواعيد الطبيب المحجوزة ({busySlots.length})
            </p>
            {busySlots.length === 0 ? (
              <p className="mb-3 text-xs text-slate-500">لا مواعيد محجوزة في هذا اليوم</p>
            ) : (
              <ul className="mb-3 max-h-36 space-y-1 overflow-y-auto">
                {busySlots.map((apt) => (
                  <li
                    key={apt.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-xs border border-slate-100"
                  >
                    <span className="font-bold tabular-nums text-rose-700" dir="ltr" lang="en">
                      {apt.time}
                    </span>
                    <span className="truncate font-semibold text-slate-700">{apt.patient_name || apt.patient}</span>
                    <span className="shrink-0 text-slate-500">
                      {apt.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mb-2 text-xs font-bold text-slate-600">اختر وقتاً فارغاً</p>
            <div className="flex flex-wrap gap-2">
              {CLINIC_TIME_SLOTS.map((slot) => {
                const free = !busyTimes.includes(slot);
                const selected = form.time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    dir="ltr"
                    lang="en"
                    disabled={!free}
                    onClick={() => setForm({ ...form, time: slot })}
                    className={[
                      "rounded-lg px-3 py-1.5 text-xs font-bold tabular-nums transition cursor-pointer",
                      selected
                        ? "bg-blue-600 text-white"
                        : free
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 line-through",
                    ].join(" ")}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-slate-600">ملاحظات</span>
          <textarea
            className="min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            placeholder="سبب الزيارة أو ملاحظة للاستقبال"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </label>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? "جاري الحجز..." : "تأكيد الحجز"}
        </button>
      </form>
    </Modal>
  );
}

export default ReceptionBookModal;