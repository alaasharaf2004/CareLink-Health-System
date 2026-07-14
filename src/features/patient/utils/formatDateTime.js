const AR_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const AR_WEEKDAYS = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

/** "2026-07-08 10:00" → { date: "2026-07-08", time: "10:00" } */
export function splitDateTime(value) {
  if (!value) return { date: "", time: "" };
  const [datePart, timePart = ""] = value.trim().split(/\s+/);
  const time = timePart.slice(0, 5);
  return { date: datePart, time };
}

/** { date, time } → "2026-07-08 10:00" */
export function joinDateTime(date, time) {
  if (!date || !time) return "";
  return `${date} ${time}`;
}

/** "2026-07-08" → Date */
export function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** عرض عربي: الأربعاء، 8 يوليو 2026 — 10:00 */
export function formatArabicDateTime(value) {
  const { date, time } = splitDateTime(value);
  if (!date) return "";

  const dt = parseLocalDate(date);
  const weekday = AR_WEEKDAYS[dt.getDay()];
  const day = dt.getDate();
  const month = AR_MONTHS[dt.getMonth()];
  const year = dt.getFullYear();

  const dateLabel = `${weekday}، ${day} ${month} ${year}`;
  return time ? `${dateLabel} — ${time}` : dateLabel;
}

export function todayIsoDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const QUICK_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];
