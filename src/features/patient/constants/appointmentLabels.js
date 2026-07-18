/** قيم DB بالإنجليزي — العرض بالعربي في الواجهة */

export const APPOINTMENT_STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  complete: "مكتمل",
  cancelled: "ملغى",
  scheduled: "مجدول",
  checked_in: "تم الحضور",
  with_doctor: "عند الطبيب",
  awaiting_lab: "بانتظار المختبر",
  results_ready: "نتائج جاهزة",
  awaiting_pharmacy: "بانتظار الصيدلية",
  completed: "مكتمل",
};

export const APPOINTMENT_TYPE_LABELS = {
  online: "عن بُعد",
  in_person: "حضوري",
  حضوري: "حضوري",
  "عن بُعد": "عن بُعد",
};

export const APPOINTMENT_STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  complete: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  scheduled: "bg-amber-50 text-amber-700 ring-amber-200",
  checked_in: "bg-sky-50 text-sky-700 ring-sky-200",
  with_doctor: "bg-blue-50 text-blue-700 ring-blue-200",
  awaiting_lab: "bg-violet-50 text-violet-700 ring-violet-200",
  results_ready: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  awaiting_pharmacy: "bg-teal-50 text-teal-700 ring-teal-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export const APPOINTMENT_TYPE_STYLES = {
  online: "bg-violet-50 text-violet-700 ring-violet-200",
  in_person: "bg-teal-50 text-teal-700 ring-teal-200",
  حضوري: "bg-teal-50 text-teal-700 ring-teal-200",
  "عن بُعد": "bg-violet-50 text-violet-700 ring-violet-200",
};

export const RECORD_TYPE_LABELS = {
  consultation: "استشارة",
  follow_up: "متابعة",
  emergency: "طوارئ",
};
