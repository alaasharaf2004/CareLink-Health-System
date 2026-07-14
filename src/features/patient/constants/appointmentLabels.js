/** قيم DB بالإنجليزي — العرض بالعربي في الواجهة */

export const APPOINTMENT_STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  complete: "مكتمل",
  cancelled: "ملغى",
};

export const APPOINTMENT_TYPE_LABELS = {
  online: "عن بُعد",
  in_person: "حضوري",
};

export const APPOINTMENT_STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  complete: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

export const APPOINTMENT_TYPE_STYLES = {
  online: "bg-violet-50 text-violet-700 ring-violet-200",
  in_person: "bg-teal-50 text-teal-700 ring-teal-200",
};

export const RECORD_TYPE_LABELS = {
  consultation: "استشارة",
  follow_up: "متابعة",
  emergency: "طوارئ",
};
