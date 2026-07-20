import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseIso(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toIso(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplay(iso) {
  const date = parseIso(iso);
  if (!date) return "Select date";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function buildMonthCells(viewYear, viewMonth) {
  const first = new Date(viewYear, viewMonth, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  for (let i = startPad - 1; i >= 0; i -= 1) {
    cells.push({
      day: prevMonthDays - i,
      inMonth: false,
      iso: toIso(new Date(viewYear, viewMonth - 1, prevMonthDays - i)),
    });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      day,
      inMonth: true,
      iso: toIso(new Date(viewYear, viewMonth, day)),
    });
  }
  while (cells.length % 7 !== 0) {
    const day = cells.length - (startPad + daysInMonth) + 1;
    cells.push({
      day,
      inMonth: false,
      iso: toIso(new Date(viewYear, viewMonth + 1, day)),
    });
  }
  return cells;
}

/**
 * English-only date picker (ISO value: YYYY-MM-DD).
 * Avoids browser native calendar locale (Arabic system UI).
 */
function CareLinkDatePicker({ value, onChange, required = false, id }) {
  const rootRef = useRef(null);
  const selected = parseIso(value) || new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  useEffect(() => {
    const date = parseIso(value);
    if (!date) return;
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  }, [value]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cells = useMemo(
    () => buildMonthCells(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const todayIso = toIso(new Date());

  const shiftMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <div className="carelink-datepicker" ref={rootRef} dir="ltr" lang="en">
      <button
        id={id}
        type="button"
        className="carelink-datepicker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="carelink-datepicker-value">{formatDisplay(value)}</span>
        <CalendarDays size={16} className="carelink-datepicker-icon" aria-hidden="true" />
      </button>

      {/* Keep form validation value without showing native picker */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        required={required}
        value={value || ""}
        onChange={() => {}}
        className="carelink-datepicker-hidden"
      />

      {open && (
        <div className="carelink-datepicker-panel" role="dialog" aria-label="Choose date">
          <div className="carelink-datepicker-head">
            <button
              type="button"
              className="carelink-datepicker-nav"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="carelink-datepicker-title">
              {MONTHS[viewMonth]} {viewYear}
            </p>
            <button
              type="button"
              className="carelink-datepicker-nav"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="carelink-datepicker-weekdays">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="carelink-datepicker-grid">
            {cells.map((cell) => {
              const isSelected = cell.iso === value;
              const isToday = cell.iso === todayIso;
              return (
                <button
                  key={`${cell.iso}-${cell.inMonth ? "m" : "o"}`}
                  type="button"
                  className={[
                    "carelink-datepicker-day",
                    cell.inMonth ? "is-in-month" : "is-out-month",
                    isSelected ? "is-selected" : "",
                    isToday ? "is-today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    onChange(cell.iso);
                    setOpen(false);
                  }}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CareLinkDatePicker;
