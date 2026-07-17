/**
 * ينزّل ملفاً وهمياً (مرحلة التصميم) عندما لا يوجد ملف حقيقي من الـ API
 */
export function downloadDummyRecordFile(fileName, meta = {}) {
  const safeName = (fileName || "medical-record.pdf").trim();
  const content = [
    "CareLink Health System — تقرير طبي (ملف تجريبي)",
    "===============================================",
    `اسم الملف: ${safeName}`,
    meta.patientName ? `المريض: ${meta.patientName}` : null,
    meta.doctorName ? `الطبيب: ${meta.doctorName}` : null,
    meta.diagnosis ? `التشخيص: ${meta.diagnosis}` : null,
    meta.notes ? `ملاحظات: ${meta.notes}` : null,
    meta.appointmentDate ? `الموعد: ${meta.appointmentDate}` : null,
    "",
    "هذا ملف وهمي للمعاينة حتى يتم ربط التخزين الفعلي.",
  ]
    .filter(Boolean)
    .join("\n");

  const blob = new Blob([`\uFEFF${content}`], {
    type: "application/pdf",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
