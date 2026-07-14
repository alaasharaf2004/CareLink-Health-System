const FIELD_LABELS = {
  name: "الاسم",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  phone: "رقم الهاتف",
  date_of_birth: "تاريخ الميلاد",
  national_id: "رقم الهوية",
  address: "العنوان",
  gender: "الجنس",
  specialty: "التخصص",
  years_of_experience: "سنوات الخبرة",
  credential_document: "ملف الشهادة",
  code: "رمز التحقق",
  otp: "رمز التحقق",
  password_confirmation: "تأكيد كلمة المرور",
};

export function getApiErrorMessages(error, fallback = "حدث خطأ غير متوقع. حاول مرة أخرى.") {
  const data = error?.response?.data;

  if (!data) {
    return [error?.message || fallback];
  }

  if (data.errors && typeof data.errors === "object") {
    const messages = Object.entries(data.errors).flatMap(([field, fieldErrors]) => {
      const label = FIELD_LABELS[field] ?? field;

      return (Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors]).map((item) => {
        const text = typeof item === "string" ? item : String(item);

        if (/required/i.test(text)) {
          return `${label} مطلوب`;
        }

        return `${label}: ${text}`;
      });
    });

    if (messages.length > 0) {
      return messages;
    }
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return [data.message];
  }

  return [fallback];
}

export function getApiErrorMessage(error, fallback = "حدث خطأ غير متوقع. حاول مرة أخرى.") {
  return getApiErrorMessages(error, fallback).join(" • ");
}
