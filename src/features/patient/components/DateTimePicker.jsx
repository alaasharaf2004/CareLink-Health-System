import { CalendarDays, Clock3 } from "lucide-react";

import {
  formatArabicDateTime,
  joinDateTime,
  splitDateTime,
  todayIsoDate,
} from "../utils/formatDateTime";

function DateTimePicker({
  value,
  onChange,
  minDate = todayIsoDate(),
  timeSlots = [],
  showPreview = true,
}) {
  const { date, time } = splitDateTime(value);

  const update = (nextDate, nextTime) => {
    onChange(joinDateTime(nextDate, nextTime));
  };

  return (
    <div className="space-y-3" dir="rtl">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-extrabold text-slate-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={16} />
            </span>
            التاريخ
          </div>
          <div className="relative" lang="en" dir="ltr">
            {!date && (
              <span className="pointer-events-none absolute inset-y-0 start-3 z-[1] flex items-center text-sm font-semibold text-slate-400">
                YYYY / MM / DD
              </span>
            )}
            <input
              type="date"
              lang="en"
              dir="ltr"
              className={`appointment-datetime-input ${!date ? "is-empty" : ""}`}
              value={date}
              min={minDate}
              onChange={(e) => update(e.target.value, time)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-extrabold text-slate-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-[#2a9d82]">
              <Clock3 size={16} />
            </span>
            الوقت
          </div>
          <div className="relative" lang="en" dir="ltr">
            {!time && (
              <span className="pointer-events-none absolute inset-y-0 start-3 z-[1] flex items-center text-sm font-semibold text-slate-400">
                -- : --
              </span>
            )}
            <input
              type="time"
              lang="en"
              dir="ltr"
              className={`appointment-datetime-input ${!time ? "is-empty" : ""}`}
              value={time}
              step={900}
              onChange={(e) => update(date, e.target.value)}
            />
          </div>
        </div>
      </div>

      {timeSlots.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5">
          <p className="mb-2.5 text-sm font-extrabold text-slate-700">
            أوقات مقترحة
          </p>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => update(date || minDate, slot)}
                className={`cursor-pointer rounded-xl border px-2 py-2 text-sm font-bold transition-all duration-200 ${
                  time === slot
                    ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200/70"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {showPreview && value && (
        <div className="rounded-2xl border border-[#40c0a0]/30 bg-gradient-to-l from-emerald-50 to-blue-50 px-4 py-3">
          <p className="text-xs font-bold text-[#2a9d82]">الموعد المختار</p>
          <p className="mt-0.5 text-sm font-extrabold text-[#101860]">
            {formatArabicDateTime(value)}
          </p>
        </div>
      )}
    </div>
  );
}

export default DateTimePicker;
