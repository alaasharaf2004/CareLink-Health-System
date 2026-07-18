/**
 * يرسم الملف الطبي على Canvas (لدعم العربية) ثم يغلّفه كملف PDF للتحميل.
 */

function wrapText(ctx, text, maxWidth) {
  const words = String(text ?? "—").split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : ["—"];
}

function jpegToPdfBytes(jpegBase64, imgWidth, imgHeight) {
  const jpeg = Uint8Array.from(atob(jpegBase64), (c) => c.charCodeAt(0));
  const pageW = 595;
  const pageH = Math.max(1, Math.round((imgHeight / imgWidth) * pageW));
  const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
  const encoder = new TextEncoder();

  const objs = [];
  const push = (bodyBytes) => {
    objs.push(bodyBytes);
    return objs.length;
  };

  const catalog = push(encoder.encode("<< /Type /Catalog /Pages 2 0 R >>"));
  const pages = push(
    encoder.encode(`<< /Type /Pages /Kids [3 0 R] /Count 1 >>`)
  );
  const page = push(
    encoder.encode(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] ` +
        `/Contents 4 0 R /Resources << /XObject << /Im0 5 0 R >> >> >>`
    )
  );
  const contents = push(
    encoder.encode(
      `<< /Length ${encoder.encode(contentStream).length} >>\nstream\n${contentStream}endstream`
    )
  );

  const imageHeader = encoder.encode(
    `<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`
  );
  const imageFooter = encoder.encode("\nendstream");
  const imageBody = new Uint8Array(imageHeader.length + jpeg.length + imageFooter.length);
  imageBody.set(imageHeader, 0);
  imageBody.set(jpeg, imageHeader.length);
  imageBody.set(imageFooter, imageHeader.length + jpeg.length);
  const image = push(imageBody);

  void catalog;
  void pages;
  void page;
  void contents;
  void image;

  const chunks = [encoder.encode("%PDF-1.4\n")];
  const offsets = [0];
  let offset = chunks[0].length;

  for (let i = 0; i < objs.length; i += 1) {
    offsets.push(offset);
    const prefix = encoder.encode(`${i + 1} 0 obj\n`);
    const suffix = encoder.encode("\nendobj\n");
    chunks.push(prefix, objs[i], suffix);
    offset += prefix.length + objs[i].length + suffix.length;
  }

  const xrefStart = offset;
  let xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objs.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  chunks.push(encoder.encode(xref));

  const total = chunks.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let cursor = 0;
  for (const part of chunks) {
    out.set(part, cursor);
    cursor += part.length;
  }
  return out;
}

export function downloadMedicalProfilePdf({ patientName, profile }) {
  const width = 794;
  const height = 1123;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#101860";
  ctx.fillRect(0, 0, width, 120);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "right";
  ctx.direction = "rtl";
  ctx.font = "bold 34px Cairo, Tahoma, Arial";
  ctx.fillText("CareLink — الملف الطبي", width - 48, 52);
  ctx.font = "20px Cairo, Tahoma, Arial";
  ctx.fillText(patientName || "المريض", width - 48, 90);

  const rows = [
    ["رقم المريض", profile.patient_id],
    ["فصيلة الدم", profile.blood_type],
    ["الوزن (كغ)", profile.weight_kg],
    ["الطول (سم)", profile.height_cm],
    ["السكري", profile.is_diabetic ? "نعم" : "لا"],
    ["ارتفاع الضغط", profile.is_hypertensive ? "نعم" : "لا"],
    ["مدخّن", profile.is_smoker ? "نعم" : "لا"],
    ["الحساسية", profile.allergies],
    ["الأمراض المزمنة", profile.chronic_diseases],
    ["الأدوية الحالية", profile.current_medications],
    ["جهة الطوارئ", profile.emergency_contact_name],
    ["هاتف الطوارئ", profile.emergency_contact_phone],
  ];

  let y = 170;
  for (const [label, value] of rows) {
    ctx.fillStyle = "#101860";
    ctx.font = "bold 18px Cairo, Tahoma, Arial";
    ctx.fillText(label, width - 48, y);
    y += 30;

    ctx.fillStyle = "#334155";
    ctx.font = "17px Cairo, Tahoma, Arial";
    const lines = wrapText(ctx, value, width - 96);
    for (const line of lines) {
      ctx.fillText(line, width - 48, y);
      y += 26;
    }
    y += 14;
  }

  ctx.fillStyle = "#64748b";
  ctx.font = "14px Cairo, Tahoma, Arial";
  ctx.fillText(`تاريخ التصدير: ${new Date().toLocaleString("ar")}`, width - 48, height - 36);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const jpegBase64 = dataUrl.split(",")[1];
  const pdfBytes = jpegToPdfBytes(jpegBase64, width, height);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `CareLink_Medical_Profile_${(patientName || "patient").replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return true;
}
