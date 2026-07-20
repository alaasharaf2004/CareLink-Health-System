export const todayIso = () => new Date().toISOString().slice(0, 10);

export const emptyAppointmentForm = (overrides = {}) => ({
  patientId: "",
  doctorId: "",
  date: todayIso(),
  time: "",
  type: "حضوري",
  notes: "",
  ...overrides,
});

export const emptyPatientForm = (overrides = {}) => ({
  name: "",
  phone: "",
  email: "",
  password: "",
  createWebAccount: true,
  nationalId: "",
  gender: "ذكر",
  guardianId: "",
  insuranceStatus: "unknown",
  insuranceProvider: "",
  receptionFlags: [],
  receptionNote: "",
  ...overrides,
});

export const RECEPTION_FLAG_OPTIONS = [
  { value: "sensitive", label: "مريض حساس", className: "bg-rose-50 text-rose-700 ring-rose-200" },
  {
    value: "needs_more_time",
    label: "يحتاج وقتاً أطول",
    className: "bg-amber-50 text-amber-800 ring-amber-200",
  },
  {
    value: "often_late",
    label: "غالباً يتأخر",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
  },
];

export const INSURANCE_STATUS_OPTIONS = [
  { value: "active", label: "تأمين نشط", className: "bg-emerald-50 text-emerald-700" },
  { value: "expired", label: "تأمين منتهٍ", className: "bg-rose-50 text-rose-700" },
  { value: "none", label: "بدون تأمين", className: "bg-slate-100 text-slate-600" },
  { value: "unknown", label: "غير محدد", className: "bg-slate-50 text-slate-500" },
];

export const flagMeta = (value) =>
  RECEPTION_FLAG_OPTIONS.find((item) => item.value === value) || {
    value,
    label: value,
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  };

export const insuranceMeta = (value) =>
  INSURANCE_STATUS_OPTIONS.find((item) => item.value === value) || INSURANCE_STATUS_OPTIONS[3];

export const statusBadgeClass = (status) => {
  switch (status) {
    case "scheduled":
      return "bg-slate-100 text-slate-700";
    case "checked_in":
      return "bg-emerald-50 text-emerald-700";
    case "with_doctor":
      return "bg-blue-50 text-blue-700";
    case "cancelled":
      return "bg-rose-50 text-rose-700";
    case "completed":
      return "bg-teal-50 text-teal-800";
    default:
      return "bg-amber-50 text-amber-800";
  }
};
