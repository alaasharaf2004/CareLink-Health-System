import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_STYLES,
  APPOINTMENT_TYPE_LABELS,
  APPOINTMENT_TYPE_STYLES,
} from "../constants/appointmentLabels";

export function AppointmentStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-center text-xs font-bold leading-none ring-1 ring-inset transition-transform duration-200 hover:scale-105 ${APPOINTMENT_STATUS_STYLES[status] ?? "bg-slate-50 text-slate-600 ring-slate-200"}`}
    >
      {APPOINTMENT_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function AppointmentTypeBadge({ type }) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-center text-xs font-bold leading-none ring-1 ring-inset transition-transform duration-200 hover:scale-105 ${APPOINTMENT_TYPE_STYLES[type] ?? "bg-slate-50 text-slate-600 ring-slate-200"}`}
    >
      {APPOINTMENT_TYPE_LABELS[type] ?? type}
    </span>
  );
}
