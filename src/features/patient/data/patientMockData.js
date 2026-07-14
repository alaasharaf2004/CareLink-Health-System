/**
 * بيانات وهمية — مرحلة التصميم (لوحة المريض)
 */

export const MOCK_PATIENT_PROFILE = {
  name: "محمد حسن",
  email: "mohammed@gmail.com",
  phone: "0598112233",
  date_of_birth: "1992-03-20",
  national_id: "403789655",
  address: "غزة، فلسطين",
  gender: "male",
  status: "active",
  profile_picture:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces",
};

export const MOCK_DOCTORS = {
  "د. أحمد علي": {
    name: "د. أحمد علي",
    specialty: "أمراض القلب",
    phone: "0599123456",
    avatar:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    rating: 4.8,
    experience_years: 12,
    patients_count: 340,
  },
  "د. سارة محمود": {
    name: "د. سارة محمود",
    specialty: "طب عام",
    phone: "0599334455",
    avatar:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    experience_years: 8,
    patients_count: 210,
  },
};

export const MOCK_MEDICAL_PROFILE = {
  patient_id: "P-1042",
  blood_type: "A+",
  weight_kg: "78",
  height_cm: "175",
  is_diabetic: false,
  is_hypertensive: true,
  is_smoker: false,
  allergies: "البنسلين",
  chronic_diseases: "ارتفاع ضغط الدم",
  current_medications: "أملوديبين 5mg",
  emergency_contact_name: "سارة علي",
  emergency_contact_phone: "0599001122",
};

export const MOCK_APPOINTMENTS = [
  {
    id: 1,
    patient_name: "محمد حسن",
    doctor_name: "د. أحمد علي",
    doctor_specialty: "أمراض القلب",
    doctor_phone: "0599123456",
    doctor_avatar: MOCK_DOCTORS["د. أحمد علي"].avatar,
    scheduled_at: "2026-07-08 10:00",
    duration_minutes: 30,
    type: "online",
    status: "pending",
    description: "متابعة ضغط الدم ومراجعة نتائج التحاليل",
    rejection_reason: "",
    zoom_link: "https://zoom.us/j/123456789",
    fee: 0,
    fee_label: "مجاني",
  },
  {
    id: 2,
    patient_name: "محمد حسن",
    doctor_name: "د. سارة محمود",
    doctor_specialty: "طب عام",
    doctor_phone: "0599334455",
    doctor_avatar: MOCK_DOCTORS["د. سارة محمود"].avatar,
    scheduled_at: "2026-07-10 14:30",
    duration_minutes: 45,
    type: "in_person",
    status: "confirmed",
    description: "فحص دوري شامل",
    rejection_reason: "",
    zoom_link: "",
    fee: 50,
    fee_label: "50 ₪",
  },
  {
    id: 3,
    patient_name: "محمد حسن",
    doctor_name: "د. أحمد علي",
    doctor_specialty: "أمراض القلب",
    doctor_phone: "0599123456",
    doctor_avatar: MOCK_DOCTORS["د. أحمد علي"].avatar,
    scheduled_at: "2026-07-03 09:00",
    duration_minutes: 30,
    type: "online",
    status: "complete",
    description: "استشارة أولية",
    rejection_reason: "",
    zoom_link: "https://zoom.us/j/987654321",
    fee: 0,
    fee_label: "مجاني",
  },
  {
    id: 4,
    patient_name: "محمد حسن",
    doctor_name: "د. أحمد علي",
    doctor_specialty: "أمراض القلب",
    doctor_phone: "0599123456",
    doctor_avatar: MOCK_DOCTORS["د. أحمد علي"].avatar,
    scheduled_at: "2026-06-28 16:00",
    duration_minutes: 30,
    type: "online",
    status: "cancelled",
    description: "متابعة علاج",
    rejection_reason: "طلب المريض إلغاء الموعد لظرف طارئ",
    zoom_link: "",
    fee: 0,
    fee_label: "مجاني",
  },
];

export const MOCK_MEDICAL_RECORDS = [
  {
    id: 1,
    doctor_name: "د. أحمد علي",
    appointment_date: "2026-07-03 09:00",
    record_type: "consultation",
    diagnosis: "ارتفاع ضغط الدم — تحت المتابعة",
    notes: "يُنصح بقياس الضغط يومياً وتقليل الملح",
    file_name: "report_mohammed.pdf",
    file_url: "#",
    patient_name: "محمد حسن",
  },
  {
    id: 2,
    doctor_name: "د. سارة محمود",
    appointment_date: "2026-05-15 11:00",
    record_type: "follow_up",
    diagnosis: "تحسّن ملحوظ في القراءات",
    notes: "الاستمرار على نفس العلاج لمدة شهر",
    file_name: "followup_mohammed.pdf",
    file_url: "#",
    patient_name: "محمد حسن",
  },
];

export function getDoctorInfo(doctorName) {
  return MOCK_DOCTORS[doctorName] ?? null;
}
