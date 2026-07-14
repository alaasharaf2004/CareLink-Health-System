/**
 * بيانات وهمية لمرحلة التصميم — بنفس شكل الـ API عشان الربط لاحقاً يكون سهل.
 */

export const MOCK_DOCTORS = [
  {
    id: 1,
    name: "Ahmed Ali",
    email: "ahmed@gmail.com",
    phone: "0599123456",
    national_id: "403789655",
    date_of_birth: "1985-05-15",
    address: "Gaza, Palestine",
    gender: "male",
    specialty: "Cardiology",
    years_of_experience: 10,
    credential_document: {
      name: "credential_ahmed.pdf",
      type: "pdf",
      url: "#",
    },
    status: "pending",
    submitted_at: "2026-07-01",
  },
  {
    id: 2,
    name: "Layla Hasan",
    email: "layla.hasan@gmail.com",
    phone: "0598765432",
    national_id: "405112233",
    date_of_birth: "1990-09-22",
    address: "Ramallah, Palestine",
    gender: "female",
    specialty: "Dermatology",
    years_of_experience: 6,
    credential_document: {
      name: "certificate_layla.png",
      type: "image",
      url: "#",
    },
    status: "pending",
    submitted_at: "2026-07-02",
  },
  {
    id: 3,
    name: "Omar Khalil",
    email: "omar.khalil@gmail.com",
    phone: "0597001122",
    national_id: "409887766",
    date_of_birth: "1982-01-30",
    address: "Nablus, Palestine",
    gender: "male",
    specialty: "Orthopedics",
    years_of_experience: 14,
    credential_document: {
      name: "license_omar.pdf",
      type: "pdf",
      url: "#",
    },
    status: "pending",
    submitted_at: "2026-07-03",
  },
  {
    id: 4,
    name: "Sara Nasser",
    email: "sara.nasser@gmail.com",
    phone: "0598112233",
    national_id: "401223344",
    date_of_birth: "1988-03-12",
    address: "Hebron, Palestine",
    gender: "female",
    specialty: "Pediatrics",
    years_of_experience: 8,
    credential_document: {
      name: "license_sara.pdf",
      type: "pdf",
      url: "#",
    },
    status: "active",
    submitted_at: "2026-06-15",
  },
  {
    id: 5,
    name: "Khaled Mansour",
    email: "khaled.m@gmail.com",
    phone: "0596445566",
    national_id: "408998877",
    date_of_birth: "1979-11-08",
    address: "Jenin, Palestine",
    gender: "male",
    specialty: "General Medicine",
    years_of_experience: 18,
    credential_document: {
      name: "license_khaled.pdf",
      type: "pdf",
      url: "#",
    },
    status: "suspended",
    submitted_at: "2026-05-20",
  },
];

/** @deprecated استخدم MOCK_DOCTORS */
export const MOCK_PENDING_DOCTORS = MOCK_DOCTORS.filter(
  (doctor) => doctor.status === "pending"
);

export const MOCK_ADS = [
  {
    id: 1,
    title: "تخفيضات رمضان للأطباء",
    link: "https://carelink.com/offers",
    image: "",
    created_at: "2026-07-01",
  },
  {
    id: 2,
    title: "خصم على الفحوصات المخبرية",
    link: "https://carelink.com/lab",
    image: "",
    created_at: "2026-07-02",
  },
];

export const MOCK_POSTS = [
  {
    id: 1,
    title: "جلسة نفسية مجانية",
    content: "جلسة مجانية عند أطباء النفس يوم الجمعة عصراً. سارعوا بالحجز.",
    image: "",
    created_at: "2026-07-01",
  },
  {
    id: 2,
    title: "حملة التبرع بالدم",
    content: "ندعوكم للمشاركة في حملة التبرع بالدم دعماً لمرضى الطوارئ.",
    image: "",
    created_at: "2026-07-02",
  },
];

export const MOCK_ADMIN_PROFILE = {
  name: "Admin",
  email: "admin@gmail.com",
};
