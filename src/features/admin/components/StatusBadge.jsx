const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  suspended: "bg-red-50 text-red-700 ring-red-200",
};

const STATUS_LABELS = {
  pending: "بانتظار التفعيل",
  active: "مفعّل",
  suspended: "موقوف",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${STATUS_STYLES[status] ?? "bg-slate-50 text-slate-600 ring-slate-200"}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default StatusBadge;
