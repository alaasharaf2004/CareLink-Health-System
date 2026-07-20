/**
 * طباعة إيصال صرف بسيط للمريض
 */
export function printDispenseReceipt({
  patientName,
  patientPhone,
  nationalId,
  medications,
  pharmacistName,
  dispensedAt,
  notes,
}) {
  const when = dispensedAt
    ? new Date(dispensedAt).toLocaleString("ar")
    : new Date().toLocaleString("ar");

  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>إيصال صرف — CareLink</title>
  <style>
    body { font-family: Tahoma, Arial, sans-serif; padding: 24px; color: #0f172a; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .sub { color: #64748b; font-size: 12px; margin-bottom: 18px; }
    .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 12px; }
    .label { color: #64748b; font-size: 11px; font-weight: bold; }
    .value { font-size: 14px; font-weight: bold; margin-top: 4px; white-space: pre-wrap; }
    .row { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .foot { margin-top: 22px; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>إيصال صرف دواء</h1>
  <div class="sub">CareLink Health System — ${when}</div>
  <div class="box row">
    <div>
      <div class="label">المريض</div>
      <div class="value">${patientName || "—"}</div>
    </div>
    <div>
      <div class="label">الجوال</div>
      <div class="value" dir="ltr">${patientPhone || "—"}</div>
    </div>
    <div>
      <div class="label">الهوية</div>
      <div class="value" dir="ltr">${nationalId || "—"}</div>
    </div>
  </div>
  <div class="box">
    <div class="label">الأدوية والجرعات</div>
    <div class="value">${medications || "—"}</div>
  </div>
  <div class="box row">
    <div>
      <div class="label">تم الصرف بواسطة</div>
      <div class="value">${pharmacistName || "الصيدلي"}</div>
    </div>
    <div>
      <div class="label">ملاحظة</div>
      <div class="value">${notes || "—"}</div>
    </div>
  </div>
  <div class="foot">احتفظ بهذا الإيصال للمراجعة الطبية عند الحاجة.</div>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  const popup = window.open("", "_blank", "width=720,height=900");
  if (!popup) {
    throw new Error("تعذر فتح نافذة الطباعة — اسمح بالنوافذ المنبثقة");
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}
