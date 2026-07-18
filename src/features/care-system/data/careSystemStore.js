const STORAGE_KEY = "carelink_care_system_v1";

const seedArticles = [
  {
    id: 1,
    slug: "balanced-diet-chronic-disease",
    category: "تغذية",
    title: "أهمية النظام الغذائي المتوازن في الوقاية من الأمراض المزمنة",
    excerpt: "دليل عملي لاختيارات يومية تساعدك على تحسين طاقتك.",
    author: "د. سارة أحمد",
    date: "2026-10-15",
    status: "published",
    image: "/images/carelink-blog-nutrition.png",
  },
  {
    id: 2,
    slug: "daily-work-stress",
    category: "صحة نفسية",
    title: "كيف تتعامل مع ضغوط العمل اليومية",
    excerpt: "خطوات بسيطة لاستعادة الهدوء النفسي.",
    author: "د. ريم حسن",
    date: "2026-10-12",
    status: "published",
    image: "/images/carelink-blog-mental.png",
  },
  {
    id: 3,
    slug: "better-sleep-habits",
    category: "صحة عامة",
    title: "عادات نوم أفضل لصحة أقوى وطاقة أوضح",
    excerpt: "دليل عملي لتحسين جودة نومك خلال أسبوع.",
    author: "د. هدى ناصر",
    date: "2026-10-03",
    status: "published",
    image: "/images/carelink-blog-sleep.png",
  },
];

const seedPosts = [
  {
    id: 1,
    title: "تحديث مواعيد العيادات",
    content: "تم تمديد ساعات العمل المسائية في فرع النصر حتى الساعة 9 مساءً.",
    created_at: "2026-07-10",
  },
  {
    id: 2,
    title: "افتتاح خدمة الاستشارة عن بُعد",
    content: "يمكن الآن حجز استشارات فيديو مع أطباء مختصين عبر المنصة.",
    created_at: "2026-07-08",
  },
];

const seedAds = [
  {
    id: 1,
    title: "خصم الفحص الشامل",
    link: "/offers",
    date: "2026-07-01",
  },
  {
    id: 2,
    title: "باقة العائلة",
    link: "/offers#packages",
    date: "2026-07-05",
  },
];

const seedStaff = [
  {
    id: "doc-1",
    role: "doctor",
    name: "د. أحمد المنصوري",
    email: "ahmed.ceo@carelink.com",
    specialty: "الطب العام",
    department: "الإدارة الطبية",
    status: "active",
  },
  {
    id: "doc-2",
    role: "doctor",
    name: "د. سارة الكواري",
    email: "sara.director@carelink.com",
    specialty: "الطب العام",
    department: "الإدارة الطبية",
    status: "active",
  },
  {
    id: "doc-3",
    role: "doctor",
    name: "د. خالد الهاشمي",
    email: "khaled.surgery@carelink.com",
    specialty: "جراحة عامة",
    department: "الجراحة",
    status: "active",
  },
  {
    id: "doc-4",
    role: "doctor",
    name: "د. أحمد كمال",
    email: "ahmed.heart@carelink.com",
    specialty: "أمراض القلب",
    department: "القلب",
    status: "active",
  },
  {
    id: "rec-1",
    role: "reception",
    name: "نورا أبو سالم",
    email: "reception@carelink.com",
    specialty: "استقبال",
    department: "الاستقبال",
    status: "active",
  },
  {
    id: "lab-1",
    role: "laboratory",
    name: "م. لينا خليل",
    email: "lab@carelink.com",
    specialty: "تحاليل طبية",
    department: "المختبر",
    status: "active",
  },
  {
    id: "pharm-1",
    role: "pharmacy",
    name: "صي. كريم ناصر",
    email: "pharmacy@carelink.com",
    specialty: "صيدلة",
    department: "الصيدلية",
    status: "active",
  },
];

const seedPatients = [
  {
    id: "pat-1",
    name: "محمد التميمي",
    email: "patient@carelink.com",
    phone: "+970591111111",
    nationalId: "400123456",
    gender: "ذكر",
    birthDate: "1992-04-12",
    hasWebAccount: true,
  },
  {
    id: "pat-2",
    name: "ريم القحطاني",
    email: "reem@example.com",
    phone: "+970592222222",
    nationalId: "400987654",
    gender: "أنثى",
    birthDate: "1988-09-03",
    hasWebAccount: true,
  },
  {
    id: "pat-3",
    name: "سامي العطار",
    email: "",
    phone: "+970593333333",
    nationalId: "401112223",
    gender: "ذكر",
    birthDate: "1975-01-20",
    hasWebAccount: false,
  },
];

const seedAppointments = [
  {
    id: "apt-1",
    patientId: "pat-1",
    doctorId: "doc-4",
    date: "2026-07-20",
    time: "10:00",
    type: "حضوري",
    status: "scheduled",
    notes: "متابعة ضغط الدم",
    createdBy: "patient",
  },
  {
    id: "apt-2",
    patientId: "pat-2",
    doctorId: "doc-3",
    date: "2026-07-20",
    time: "11:30",
    type: "حضوري",
    status: "checked_in",
    notes: "ألم في الركبة",
    createdBy: "reception",
  },
  {
    id: "apt-3",
    patientId: "pat-3",
    doctorId: "doc-4",
    date: "2026-07-19",
    time: "09:00",
    type: "حضوري",
    status: "with_doctor",
    notes: "تسجيل عبر الاستقبال بدون حساب ويب",
    createdBy: "reception",
  },
];

const seedVisits = [
  {
    id: "vis-1",
    appointmentId: "apt-3",
    patientId: "pat-3",
    doctorId: "doc-4",
    status: "with_doctor",
    diagnosis: "",
    clinicalNotes: "",
    endedAt: null,
  },
];

const seedLabOrders = [];
const seedPrescriptions = [];

const seedSiteSettings = {
  platformName: "CareLink",
  supportPhone: "+970 59 123 4567",
  supportEmail: "support@carelink.com",
  address: "فلسطين، قطاع غزة",
  socialWeb: "https://carelink.com",
  socialWhatsapp: "https://wa.me/970591234567",
  showBlog: true,
  showOffers: true,
  showDoctors: true,
  showFaq: true,
};

function createSeedState() {
  return {
    articles: seedArticles,
    posts: seedPosts,
    ads: seedAds,
    staff: seedStaff,
    patients: seedPatients,
    appointments: seedAppointments,
    visits: seedVisits,
    labOrders: seedLabOrders,
    prescriptions: seedPrescriptions,
    siteSettings: seedSiteSettings,
    medicalProfiles: {},
    patientAccounts: [
      {
        patientId: "pat-1",
        email: "patient@carelink.com",
        password: "123456",
      },
      {
        patientId: "pat-2",
        email: "reem@example.com",
        password: "123456",
      },
    ],
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return {
      ...createSeedState(),
      ...parsed,
      medicalProfiles: parsed.medicalProfiles || {},
      patientAccounts: parsed.patientAccounts || [],
    };
  } catch {
    return createSeedState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("carelink-store-updated"));
}

let state = typeof window !== "undefined" ? loadState() : createSeedState();

function refresh() {
  state = loadState();
  return state;
}

function update(mutator) {
  const next = mutator({ ...state });
  state = next;
  saveState(state);
  return state;
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export const DEMO_ACCOUNTS = [
  { email: "patient@carelink.com", password: "123456", role: "patient", name: "محمد التميمي", staffId: null, patientId: "pat-1" },
  { email: "ahmed.heart@carelink.com", password: "123456", role: "doctor", name: "د. أحمد كمال", staffId: "doc-4", patientId: null },
  { email: "reception@carelink.com", password: "123456", role: "reception", name: "نورا أبو سالم", staffId: "rec-1", patientId: null },
  { email: "lab@carelink.com", password: "123456", role: "laboratory", name: "م. لينا خليل", staffId: "lab-1", patientId: null },
  { email: "pharmacy@carelink.com", password: "123456", role: "pharmacy", name: "صي. كريم ناصر", staffId: "pharm-1", patientId: null },
  { email: "admin@carelink.com", password: "123456", role: "admin", name: "المسؤول", staffId: null, patientId: null },
];

export const CLINIC_TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

export function tryDemoLogin(email, password, role) {
  const normalizedEmail = email.trim().toLowerCase();
  const demo = DEMO_ACCOUNTS.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password &&
      item.role === role
  );
  if (demo) return demo;

  if (role === "patient") {
    const account = careSystemStore.findPatientAccount(normalizedEmail, password);
    if (account) {
      const patient = careSystemStore.getPatient(account.patientId);
      return {
        email: account.email,
        password: account.password,
        role: "patient",
        name: patient?.name || "مريض",
        staffId: null,
        patientId: account.patientId,
      };
    }
  }

  return null;
}

function isActiveAppointment(appointment) {
  return appointment.status !== "cancelled";
}

function normalizeTime(time) {
  if (!time) return "";
  const [h = "00", m = "00"] = String(time).split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

export const careSystemStore = {
  getState: () => refresh(),

  // Articles
  listArticles: () => refresh().articles,
  saveArticle: (article) =>
    update((s) => {
      if (article.id) {
        return {
          ...s,
          articles: s.articles.map((item) =>
            item.id === article.id ? { ...item, ...article } : item
          ),
        };
      }
      return {
        ...s,
        articles: [{ ...article, id: Date.now(), date: new Date().toISOString().slice(0, 10) }, ...s.articles],
      };
    }),
  deleteArticle: (id) =>
    update((s) => ({ ...s, articles: s.articles.filter((item) => item.id !== id) })),

  // Posts
  listPosts: () => refresh().posts,
  savePost: (post) =>
    update((s) => {
      if (post.id) {
        return {
          ...s,
          posts: s.posts.map((item) => (item.id === post.id ? { ...item, ...post } : item)),
        };
      }
      return {
        ...s,
        posts: [
          { ...post, id: Date.now(), created_at: new Date().toISOString().slice(0, 10) },
          ...s.posts,
        ],
      };
    }),
  deletePost: (id) =>
    update((s) => ({ ...s, posts: s.posts.filter((item) => item.id !== id) })),

  // Ads
  listAds: () => refresh().ads,
  saveAd: (ad) =>
    update((s) => {
      if (ad.id) {
        return {
          ...s,
          ads: s.ads.map((item) => (item.id === ad.id ? { ...item, ...ad } : item)),
        };
      }
      return {
        ...s,
        ads: [{ ...ad, id: Date.now(), date: new Date().toISOString().slice(0, 10) }, ...s.ads],
      };
    }),
  deleteAd: (id) =>
    update((s) => ({ ...s, ads: s.ads.filter((item) => item.id !== id) })),

  // Staff
  listStaff: (role) => {
    const all = refresh().staff;
    return role ? all.filter((item) => item.role === role) : all;
  },
  saveStaff: (member) =>
    update((s) => {
      if (member.id) {
        return {
          ...s,
          staff: s.staff.map((item) => (item.id === member.id ? { ...item, ...member } : item)),
        };
      }
      return {
        ...s,
        staff: [{ ...member, id: uid(member.role?.slice(0, 3) || "stf"), status: "active" }, ...s.staff],
      };
    }),
  setStaffStatus: (id, status) =>
    update((s) => ({
      ...s,
      staff: s.staff.map((item) => (item.id === id ? { ...item, status } : item)),
    })),
  deleteStaff: (id) =>
    update((s) => ({ ...s, staff: s.staff.filter((item) => item.id !== id) })),

  // Patients
  listPatients: () => refresh().patients,
  getPatient: (id) => refresh().patients.find((item) => item.id === id),
  savePatient: (patient) => {
    const { password, createWebAccount, ...rest } = patient;
    const email = String(rest.email || "").trim().toLowerCase();
    const wantsAccount = Boolean(createWebAccount && email && password);

    if (wantsAccount) {
      const accounts = refresh().patientAccounts || [];
      if (accounts.some((item) => item.email.toLowerCase() === email)) {
        throw new Error("البريد الإلكتروني مسجل مسبقاً لحساب مريض آخر");
      }
    }

    let createdId = patient.id || null;
    update((s) => {
      if (patient.id) {
        const nextPatients = s.patients.map((item) =>
          item.id === patient.id
            ? {
                ...item,
                ...rest,
                hasWebAccount: wantsAccount || item.hasWebAccount || Boolean(rest.email),
              }
            : item
        );
        let patientAccounts = s.patientAccounts || [];
        if (wantsAccount) {
          const existing = patientAccounts.find((a) => a.patientId === patient.id);
          if (existing) {
            patientAccounts = patientAccounts.map((a) =>
              a.patientId === patient.id ? { ...a, email, password } : a
            );
          } else {
            patientAccounts = [
              { id: uid("acc"), patientId: patient.id, email, password },
              ...patientAccounts,
            ];
          }
        }
        return { ...s, patients: nextPatients, patientAccounts };
      }

      const id = uid("pat");
      createdId = id;
      const created = {
        ...rest,
        id,
        email: rest.email || "",
        hasWebAccount: wantsAccount,
      };
      const patientAccounts = wantsAccount
        ? [{ id: uid("acc"), patientId: id, email, password }, ...(s.patientAccounts || [])]
        : s.patientAccounts || [];

      return {
        ...s,
        patients: [created, ...s.patients],
        patientAccounts,
      };
    });

    return careSystemStore.getPatient(createdId);
  },

  // Appointments
  listAppointments: () => refresh().appointments,
  getAppointment: (id) => refresh().appointments.find((item) => item.id === id),
  isSlotAvailable: (doctorId, date, time, excludeAppointmentId = null) => {
    if (!doctorId || !date || !time) return false;
    const slot = normalizeTime(time);
    return !refresh().appointments.some(
      (apt) =>
        apt.doctorId === doctorId &&
        apt.date === date &&
        normalizeTime(apt.time) === slot &&
        isActiveAppointment(apt) &&
        apt.id !== excludeAppointmentId
    );
  },
  getAvailableSlots: (doctorId, date, excludeAppointmentId = null) => {
    if (!doctorId || !date) return [];
    return CLINIC_TIME_SLOTS.filter((slot) =>
      careSystemStore.isSlotAvailable(doctorId, date, slot, excludeAppointmentId)
    );
  },
  getDoctorDaySchedule: (doctorId, date) => {
    if (!doctorId || !date) return [];
    const { patientName } = careSystemStore.resolveNames();
    return refresh()
      .appointments.filter(
        (apt) => apt.doctorId === doctorId && apt.date === date && isActiveAppointment(apt)
      )
      .map((apt) => ({
        ...apt,
        time: normalizeTime(apt.time),
        patient: patientName(apt.patientId),
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  },
  saveAppointment: (appointment) => {
    const time = normalizeTime(appointment.time);
    if (
      !appointment.id &&
      !careSystemStore.isSlotAvailable(appointment.doctorId, appointment.date, time)
    ) {
      throw new Error("هذا الوقت محجوز لدى الطبيب — اختر وقتاً فارغاً من جدول المواعيد");
    }

    update((s) => {
      if (appointment.id) {
        return {
          ...s,
          appointments: s.appointments.map((item) =>
            item.id === appointment.id ? { ...item, ...appointment, time } : item
          ),
        };
      }
      return {
        ...s,
        appointments: [
          {
            ...appointment,
            id: uid("apt"),
            time,
            status: appointment.status || "scheduled",
          },
          ...s.appointments,
        ],
      };
    });
  },
  setAppointmentStatus: (id, status) =>
    update((s) => ({
      ...s,
      appointments: s.appointments.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    })),

  // Visits
  listVisits: () => refresh().visits,
  getVisitByAppointment: (appointmentId) =>
    refresh().visits.find((item) => item.appointmentId === appointmentId),
  upsertVisit: (visit) =>
    update((s) => {
      const existing = s.visits.find((item) => item.appointmentId === visit.appointmentId);
      if (existing) {
        return {
          ...s,
          visits: s.visits.map((item) =>
            item.id === existing.id ? { ...item, ...visit } : item
          ),
        };
      }
      return {
        ...s,
        visits: [{ ...visit, id: uid("vis") }, ...s.visits],
      };
    }),

  // Lab
  listLabOrders: () => refresh().labOrders,
  saveLabOrder: (order) =>
    update((s) => {
      if (order.id) {
        return {
          ...s,
          labOrders: s.labOrders.map((item) =>
            item.id === order.id ? { ...item, ...order } : item
          ),
        };
      }
      return {
        ...s,
        labOrders: [
          {
            ...order,
            id: uid("lab"),
            status: order.status || "pending",
            createdAt: new Date().toISOString(),
          },
          ...s.labOrders,
        ],
      };
    }),

  // Prescriptions
  listPrescriptions: () => refresh().prescriptions,
  savePrescription: (rx) =>
    update((s) => {
      if (rx.id) {
        return {
          ...s,
          prescriptions: s.prescriptions.map((item) =>
            item.id === rx.id ? { ...item, ...rx } : item
          ),
        };
      }
      return {
        ...s,
        prescriptions: [
          {
            ...rx,
            id: uid("rx"),
            status: rx.status || "pending",
            createdAt: new Date().toISOString(),
          },
          ...s.prescriptions,
        ],
      };
    }),

  // Settings
  getSiteSettings: () => refresh().siteSettings,
  saveSiteSettings: (settings) =>
    update((s) => ({ ...s, siteSettings: { ...s.siteSettings, ...settings } })),

  // Medical profiles
  getMedicalProfile: (patientId) => refresh().medicalProfiles?.[patientId] || null,
  saveMedicalProfile: (patientId, profile) =>
    update((s) => ({
      ...s,
      medicalProfiles: {
        ...(s.medicalProfiles || {}),
        [patientId]: {
          ...profile,
          patientId,
          updatedAt: new Date().toISOString(),
        },
      },
    })),

  // Patient web accounts
  findPatientAccount: (email, password) => {
    const accounts = refresh().patientAccounts || [];
    return (
      accounts.find(
        (item) =>
          item.email.toLowerCase() === String(email).trim().toLowerCase() &&
          item.password === password
      ) || null
    );
  },

  // Helpers
  resolveNames: () => {
    const s = refresh();
    return {
      patientName: (id) => s.patients.find((p) => p.id === id)?.name || "—",
      doctorName: (id) => s.staff.find((d) => d.id === id)?.name || "—",
      staffById: (id) => s.staff.find((d) => d.id === id) || null,
    };
  },
};

export const APPOINTMENT_STATUS_LABELS = {
  scheduled: "مجدول",
  checked_in: "تم الحضور",
  with_doctor: "عند الطبيب",
  awaiting_lab: "بانتظار المختبر",
  results_ready: "نتائج جاهزة",
  awaiting_pharmacy: "بانتظار الصيدلية",
  completed: "مكتمل",
  cancelled: "ملغى",
};

export default careSystemStore;
