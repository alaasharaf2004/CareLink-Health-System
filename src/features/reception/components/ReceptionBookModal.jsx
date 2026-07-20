import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import CareLinkDatePicker from "../../../components/CareLinkDatePicker";
import Modal from "../../admin/components/Modal";
import {
  APPOINTMENT_STATUS_LABELS,
  CLINIC_TIME_SLOTS,
  careSystemStore,
} from "../../care-system/data/careSystemStore";
import { emptyAppointmentForm } from "../utils/receptionHelpers";

function ReceptionBookModal({
  patients,
  doctors,
  initialForm,
  onClose,
  onSuccess,
  onError,
}) {
  const [form, setForm] = useState(() => emptyAppointmentForm(initialForm));

  const freeSlots = useMemo(() => {
    if (!form.doctorId || !form.date) return [];
    return careSystemStore.getAvailableSlots(form.doctorId, form.date);
  }, [form.doctorId, form.date]);

  const busySlots = useMemo(() => {
    if (!form.doctorId || !form.date) return [];
    return careSystemStore.getDoctorDaySchedule(form.doctorId, form.date);
  }, [form.doctorId, form.date]);

  const saveAppointment = (event) => {
    event.preventDefault();
    if (!form.time) {
      onError?.("اختر وقتاً فارغاً من جدول الطبيب");
      return;
    }
    try {
      careSystemStore.saveAppointment({
        ...form,
        createdBy: "reception",
        status: "scheduled",
      });
      onSuccess?.(form);
    } catch (error) {
      onError?.(error.message || "تعذر إنشاء الموعد");
    }
  };

  return (
    <Modal title="حجز موعد للمريض" onClose={onClose} maxWidth="max-w-2xl">
      <form className="space-y-4" onSubmit={saveAppointment}>
        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-slate-600">المريض</span>
          <div className="carelink-field">
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              required
            >
              <option value="">اختر المريض</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
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
              >
                <option value="">اختر الطبيب</option>
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
                    className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-xs"
                  >
                    <span className="font-bold tabular-nums text-rose-700" dir="ltr" lang="en">
                      {apt.time}
                    </span>
                    <span className="truncate font-semibold text-slate-700">{apt.patient}</span>
                    <span className="shrink-0 text-slate-500">
                      {APPOINTMENT_STATUS_LABELS[apt.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mb-2 text-xs font-bold text-slate-600">اختر وقتاً فارغاً</p>
            <div className="flex flex-wrap gap-2">
              {CLINIC_TIME_SLOTS.map((slot) => {
                const free = freeSlots.includes(slot);
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
                      "rounded-lg px-3 py-1.5 text-xs font-bold tabular-nums transition",
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

        <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700">
          تأكيد الحجز
        </button>
      </form>
    </Modal>
  );
}

export default ReceptionBookModal;
