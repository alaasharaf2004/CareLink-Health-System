const STORAGE_KEY = "carelink_care_system_v2";

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
    password: "123456",
    mustChangePassword: false,
  },
  {
    id: "doc-2",
    role: "doctor",
    name: "د. سارة الكواري",
    email: "sara.director@carelink.com",
    specialty: "الطب العام",
    department: "الإدارة الطبية",
    status: "active",
    password: "123456",
    mustChangePassword: false,
  },
  {
    id: "doc-3",
    role: "doctor",
    name: "د. خالد الهاشمي",
    email: "khaled.surgery@carelink.com",
    specialty: "جراحة عامة",
    department: "الجراحة",
    status: "active",
    password: "123456",
    mustChangePassword: false,
  },
  {
    id: "doc-4",
    role: "doctor",
    name: "د. أحمد كمال",
    email: "ahmed.heart@carelink.com",
    specialty: "أمراض القلب",
    department: "القلب",
    status: "active",
    password: "123456",
    mustChangePassword: false,
  },
  {
    id: "rec-1",
    role: "reception",
    name: "نورا أبو سالم",
    email: "reception@carelink.com",
    specialty: "استقبال",
    department: "الاستقبال",
    status: "active",
    password: "123456",
    mustChangePassword: false,
  },
  {
    id: "lab-1",
    role: "laboratory",
    name: "م. لينا خليل",
    email: "lab@carelink.com",
    specialty: "تحاليل طبية",
    department: "المختبر",
    status: "active",
    password: "123456",
    mustChangePassword: false,
  },
  {
    id: "pharm-1",
    role: "pharmacy",
    name: "صي. كريم ناصر",
    email: "pharmacy@carelink.com",
    specialty: "صيدلة",
    department: "الصيدلية",
    status: "active",
    password: "123456",
    mustChangePassword: false,
  },
  {
    id: "rad-1",
    role: "radiology",
    name: "فني. سامر عبده",
    email: "radiology@carelink.com",
    specialty: "تصوير طبي",
    department: "الأشعة",
    status: "active",
    password: "123456",
    mustChangePassword: false,
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
    guardianId: null,
    insuranceStatus: "active",
    insuranceProvider: "التأمين الوطني",
    receptionFlags: ["needs_more_time"],
    receptionNote: "مريض يحتاج شرحاً أطول للإجراءات",
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
    guardianId: null,
    insuranceStatus: "active",
    insuranceProvider: "تكافل",
    receptionFlags: [],
    receptionNote: "",
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
    guardianId: null,
    insuranceStatus: "expired",
    insuranceProvider: "التأمين الوطني",
    receptionFlags: ["often_late"],
    receptionNote: "غالباً يتأخر عن الموعد",
  },
  {
    id: "pat-4",
    name: "ليان التميمي",
    email: "",
    phone: "+970591111111",
    nationalId: "409998887",
    gender: "أنثى",
    birthDate: "2018-06-01",
    hasWebAccount: false,
    guardianId: "pat-1",
    insuranceStatus: "active",
    insuranceProvider: "التأمين الوطني",
    receptionFlags: ["sensitive"],
    receptionNote: "طفلة — تابع لوالدها محمد التميمي",
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
    status: "awaiting_pharmacy",
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
    status: "awaiting_pharmacy",
    diagnosis: "ارتفاع ضغط الدم — متابعة",
    clinicalNotes: "يحتاج صرف أدوية من الصيدلية",
    endedAt: null,
  },
];

const seedLabOrders = [];
const seedImagingOrders = [];
const seedPrescriptions = [
  {
    id: "rx-demo-1",
    appointmentId: "apt-3",
    patientId: "pat-3",
    doctorId: "doc-4",
    medications: "أملوديبين 5 ملغ — قرص مرة يومياً\nأسبرين 100 ملغ — قرص مساءً بعد الأكل",
    status: "pending",
    createdAt: "2026-07-19T09:30:00.000Z",
  },
];

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

const seedInventory = [
  {
    id: "inv-1",
    name: "أملوديبين 5 ملغ",
    keywords: ["أملوديبين", "املوديبين", "amlodipine"],
    quantity: 15,
    minQuantity: 20,
    unit: "علبة",
  },
  {
    id: "inv-2",
    name: "أسبرين 100 ملغ",
    keywords: ["أسبرين", "اسبرين", "aspirin"],
    quantity: 64,
    minQuantity: 25,
    unit: "علبة",
  },
  {
    id: "inv-3",
    name: "ميتفورمين 500 ملغ",
    keywords: ["ميتفورمين", "metformin"],
    quantity: 40,
    minQuantity: 15,
    unit: "علبة",
  },
  {
    id: "inv-4",
    name: "أموكسيسيلين 500 ملغ",
    keywords: ["أموكسيسيلين", "اموكسيسيلين", "amoxicillin", "بنسلين"],
    quantity: 22,
    minQuantity: 10,
    unit: "علبة",
  },
  {
    id: "inv-5",
    name: "باراسيتامول 500 ملغ",
    keywords: ["باراسيتامول", "paracetamol", "بنادول"],
    quantity: 120,
    minQuantity: 30,
    unit: "علبة",
  },
];

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
    imagingOrders: seedImagingOrders,
    prescriptions: seedPrescriptions,
    dispenseLogs: [],
    inventory: seedInventory,
    patientNotifications: [],
    chatMessages: [],
    broadcasts: [],
    shiftHandovers: [],
    siteSettings: seedSiteSettings,
    medicalProfiles: {
      "pat-1": {
        patientId: "pat-1",
        blood_type: "A+",
        allergies: "لا يوجد",
        status: "مستقر",
      },
      "pat-3": {
        patientId: "pat-3",
        blood_type: "O+",
        allergies: "أسبرين، بنسلين",
        status: "متابعة ضغط",
      },
    },
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
    const seed = createSeedState();
    const legacyAds = parsed.ads || [];
    const adsNeedMigrate =
      legacyAds.length > 0 &&
      legacyAds.every((ad) => !ad.description && !ad.image);

    const mergedStaff = (parsed.staff || seed.staff).map((member) => {
      const seedMatch = seed.staff.find((item) => item.id === member.id);
      return {
        ...seedMatch,
        ...member,
        password: member.password || seedMatch?.password || "123456",
        mustChangePassword: Boolean(member.mustChangePassword),
      };
    });
    const mergedIds = new Set(mergedStaff.map((item) => item.id));
    const missingSeedStaff = seed.staff.filter((item) => !mergedIds.has(item.id));

    const parsedPatients = parsed.patients || seed.patients;
    const patientIds = new Set(parsedPatients.map((item) => item.id));
    const missingSeedPatients = seed.patients.filter((item) => !patientIds.has(item.id));
    const mergedPatients = [...parsedPatients, ...missingSeedPatients].map((patient) => {
      const seedMatch = seed.patients.find((item) => item.id === patient.id);
      return {
        ...seedMatch,
        ...patient,
        guardianId: patient.guardianId ?? seedMatch?.guardianId ?? null,
        insuranceStatus: patient.insuranceStatus || seedMatch?.insuranceStatus || "unknown",
        insuranceProvider: patient.insuranceProvider ?? seedMatch?.insuranceProvider ?? "",
        receptionFlags: Array.isArray(patient.receptionFlags)
          ? patient.receptionFlags
          : seedMatch?.receptionFlags || [],
        receptionNote: patient.receptionNote ?? seedMatch?.receptionNote ?? "",
      };
    });

    return {
      ...seed,
      ...parsed,
      staff: [...mergedStaff, ...missingSeedStaff],
      patients: mergedPatients,
      ads: adsNeedMigrate ? seed.ads : legacyAds.length ? legacyAds : seed.ads,
      medicalProfiles: {
        ...(createSeedState().medicalProfiles || {}),
        ...(parsed.medicalProfiles || {}),
      },
      patientAccounts: parsed.patientAccounts || [],
      chatMessages: parsed.chatMessages || [],
      broadcasts: parsed.broadcasts || [],
      dispenseLogs: parsed.dispenseLogs || [],
      inventory:
        Array.isArray(parsed.inventory) && parsed.inventory.length
          ? parsed.inventory
          : createSeedState().inventory,
      patientNotifications: parsed.patientNotifications || [],
      imagingOrders: Array.isArray(parsed.imagingOrders) ? parsed.imagingOrders : [],
      shiftHandovers: Array.isArray(parsed.shiftHandovers) ? parsed.shiftHandovers : [],
    };
  } catch {
    return createSeedState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("carelink-store-updated"));
  try {
    const channel = new BroadcastChannel("carelink-store");
    channel.postMessage({ type: "carelink-store-updated" });
    channel.close();
  } catch {
    // BroadcastChannel غير مدعوم — نعتمد على storage event
  }
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
  { email: "radiology@carelink.com", password: "123456", role: "radiology", name: "فني. سامر عبده", staffId: "rad-1", patientId: null },
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
  if (demo) {
    return {
      ...demo,
      mustChangePassword: false,
    };
  }

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
        mustChangePassword: false,
      };
    }
  }

  const staffRoles = ["reception", "laboratory", "pharmacy", "radiology", "doctor"];
  if (staffRoles.includes(role)) {
    const staff = careSystemStore.findStaffLogin(normalizedEmail, password, role);
    if (staff) {
      if (staff.status === "suspended" || staff.status === "disabled") {
        throw new Error("هذا الحساب معطّل. راجع الإدارة لإعادة التفعيل.");
      }
      return {
        email: staff.email,
        password: staff.password,
        role: staff.role,
        name: staff.name,
        staffId: staff.id,
        patientId: null,
        mustChangePassword: Boolean(staff.mustChangePassword),
      };
    }
  }

  return null;
}

function generateTempPassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const ROLE_EMAIL_PREFIX = {
  reception: "reception",
  laboratory: "lab",
  pharmacy: "pharmacy",
  radiology: "radiology",
  doctor: "doctor",
};

const ROLE_DEFAULTS = {
  reception: { department: "الاستقبال", specialty: "استقبال" },
  laboratory: { department: "المختبر", specialty: "تحاليل طبية" },
  pharmacy: { department: "الصيدلية", specialty: "صيدلة" },
  radiology: { department: "الأشعة", specialty: "تصوير طبي" },
  doctor: { department: "العيادات", specialty: "الطب العام" },
};

export function suggestStaffEmail(role) {
  const prefix = ROLE_EMAIL_PREFIX[role] || "staff";
  let email = "";
  do {
    email = `${prefix}.${Math.random().toString(36).slice(2, 7)}@carelink.com`;
  } while (
    careSystemStore.listStaff().some(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    )
  );
  return email;
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
  getStaff: (id) => refresh().staff.find((item) => item.id === id),
  findStaffLogin: (email, password, role) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    return (
      refresh().staff.find(
        (item) =>
          item.email?.toLowerCase() === normalizedEmail &&
          item.password === password &&
          (!role || item.role === role)
      ) || null
    );
  },
  /**
   * Admin creates clinic staff with generated email + temporary password.
   * Returns { member, temporaryPassword } so admin can share credentials once.
   */
  createStaffWithCredentials: ({ name, role, department, specialty, email }) => {
    if (!name?.trim()) throw new Error("اسم الموظف مطلوب");
    if (!role) throw new Error("دور الموظف مطلوب");

    const defaults = ROLE_DEFAULTS[role] || {};
    const resolvedEmail = String(email || suggestStaffEmail(role)).trim().toLowerCase();
    const temporaryPassword = generateTempPassword();

    const exists = refresh().staff.some(
      (item) => item.email.toLowerCase() === resolvedEmail
    );
    if (exists) throw new Error("البريد الإلكتروني مستخدم مسبقاً");

    const id = uid(role.slice(0, 3) || "stf");
    const member = {
      id,
      role,
      name: name.trim(),
      email: resolvedEmail,
      department: department?.trim() || defaults.department || "",
      specialty: specialty?.trim() || defaults.specialty || "",
      status: "active",
      password: temporaryPassword,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
    };

    update((s) => ({
      ...s,
      staff: [member, ...s.staff],
    }));

    return { member, temporaryPassword };
  },
  saveStaff: (member) =>
    update((s) => {
      if (member.id) {
        const { password, temporaryPassword, ...safe } = member;
        return {
          ...s,
          staff: s.staff.map((item) =>
            item.id === member.id
              ? {
                  ...item,
                  ...safe,
                  // Keep existing password unless explicitly resetting
                  password: password || item.password,
                }
              : item
          ),
        };
      }
      return {
        ...s,
        staff: [
          {
            ...member,
            id: uid(member.role?.slice(0, 3) || "stf"),
            status: member.status || "active",
            mustChangePassword: member.mustChangePassword ?? true,
            password: member.password || generateTempPassword(),
          },
          ...s.staff,
        ],
      };
    }),
  resetStaffTemporaryPassword: (id) => {
    const temporaryPassword = generateTempPassword();
    update((s) => ({
      ...s,
      staff: s.staff.map((item) =>
        item.id === id
          ? {
              ...item,
              password: temporaryPassword,
              mustChangePassword: true,
            }
          : item
      ),
    }));
    return temporaryPassword;
  },
  changeStaffPassword: (id, newPassword) => {
    if (!newPassword || String(newPassword).length < 6) {
      throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }
    update((s) => ({
      ...s,
      staff: s.staff.map((item) =>
        item.id === id
          ? {
              ...item,
              password: newPassword,
              mustChangePassword: false,
            }
          : item
      ),
    }));
  },
  setStaffStatus: (id, status) =>
    update((s) => ({
      ...s,
      staff: s.staff.map((item) => (item.id === id ? { ...item, status } : item)),
    })),
  /** Soft-disable preferred over hard delete to keep historical records. */
  disableStaff: (id) => careSystemStore.setStaffStatus(id, "suspended"),
  enableStaff: (id) => careSystemStore.setStaffStatus(id, "active"),
  deleteStaff: (id) =>
    update((s) => ({ ...s, staff: s.staff.filter((item) => item.id !== id) })),

  // Patients
  listPatients: () => refresh().patients,
  getPatient: (id) => refresh().patients.find((item) => item.id === id),
  listDependents: (guardianId) =>
    refresh().patients.filter((p) => String(p.guardianId || "") === String(guardianId)),
  getGuardian: (patientId) => {
    const patient = careSystemStore.getPatient(patientId);
    if (!patient?.guardianId) return null;
    return careSystemStore.getPatient(patient.guardianId);
  },
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
      const normalized = {
        ...rest,
        guardianId: rest.guardianId || null,
        insuranceStatus: rest.insuranceStatus || "unknown",
        insuranceProvider: rest.insuranceProvider || "",
        receptionFlags: Array.isArray(rest.receptionFlags) ? rest.receptionFlags : [],
        receptionNote: rest.receptionNote || "",
      };

      if (patient.id) {
        const nextPatients = s.patients.map((item) =>
          item.id === patient.id
            ? {
                ...item,
                ...normalized,
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
        ...normalized,
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

  updatePatientReceptionMeta: (patientId, patch) => {
    if (!patientId) return null;
    update((s) => ({
      ...s,
      patients: s.patients.map((item) =>
        item.id === patientId
          ? {
              ...item,
              ...patch,
              receptionFlags: Array.isArray(patch.receptionFlags)
                ? patch.receptionFlags
                : item.receptionFlags || [],
            }
          : item
      ),
    }));
    return careSystemStore.getPatient(patientId);
  },

  // Reception shift handover
  listShiftHandovers: (limit = 20) =>
    [...(refresh().shiftHandovers || [])]
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, limit),
  addShiftHandover: ({ message, authorName = "الاستقبال", authorId = null }) => {
    const text = String(message || "").trim();
    if (!text) throw new Error("اكتب ملاحظة تسليم الوردية");
    const item = {
      id: uid("sho"),
      message: text,
      authorName,
      authorId,
      createdAt: new Date().toISOString(),
      acknowledged: false,
    };
    update((s) => ({
      ...s,
      shiftHandovers: [item, ...(s.shiftHandovers || [])],
    }));
    return item;
  },
  acknowledgeShiftHandover: (id) =>
    update((s) => ({
      ...s,
      shiftHandovers: (s.shiftHandovers || []).map((item) =>
        item.id === id
          ? { ...item, acknowledged: true, acknowledgedAt: new Date().toISOString() }
          : item
      ),
    })),

  getReceptionDaySummary: (dateIso) => {
    const day = dateIso || new Date().toISOString().slice(0, 10);
    const list = refresh().appointments.filter((apt) => apt.date === day);
    return {
      date: day,
      total: list.length,
      completed: list.filter((a) => a.status === "completed").length,
      cancelled: list.filter((a) => a.status === "cancelled").length,
      noShow: list.filter((a) => a.status === "scheduled").length,
      checkedIn: list.filter((a) => a.status === "checked_in").length,
      withDoctor: list.filter((a) => a.status === "with_doctor").length,
      awaitingLab: list.filter((a) => a.status === "awaiting_lab").length,
      awaitingRadiology: list.filter((a) => a.status === "awaiting_radiology").length,
      awaitingPharmacy: list.filter((a) => a.status === "awaiting_pharmacy").length,
    };
  },

  getWaitingRoomQueue: (dateIso) => {
    const day = dateIso || new Date().toISOString().slice(0, 10);
    const { patientName, doctorName } = careSystemStore.resolveNames();
    return refresh()
      .appointments.filter(
        (apt) =>
          apt.date === day &&
          ["checked_in", "with_doctor", "scheduled"].includes(apt.status)
      )
      .sort((a, b) => String(a.time).localeCompare(String(b.time)))
      .map((apt, index) => ({
        ...apt,
        queueNumber: index + 1,
        patient: patientName(apt.patientId),
        doctor: doctorName(apt.doctorId),
      }));
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

  // Radiology / imaging
  listImagingOrders: () => refresh().imagingOrders || [],
  saveImagingOrder: (order) =>
    update((s) => {
      const imagingOrders = s.imagingOrders || [];
      if (order.id) {
        return {
          ...s,
          imagingOrders: imagingOrders.map((item) =>
            item.id === order.id ? { ...item, ...order } : item
          ),
        };
      }
      return {
        ...s,
        imagingOrders: [
          {
            ...order,
            id: uid("img"),
            status: order.status || "pending",
            createdAt: new Date().toISOString(),
          },
          ...imagingOrders,
        ],
      };
    }),

  // Prescriptions
  listPrescriptions: () => refresh().prescriptions,
  listPrescriptionsByAppointment: (appointmentId) =>
    refresh().prescriptions.filter((item) => item.appointmentId === appointmentId),
  savePrescription: (rx) =>
    update((s) => {
      // نجلب بيانات المريض وقت الحفظ حتى تظهر للصيدلية حتى لو تغيّر السجل لاحقاً
      const patient =
        (rx.patientId && s.patients.find((p) => p.id === rx.patientId)) || null;

      const clean = {
        id: rx.id,
        appointmentId: rx.appointmentId,
        patientId: rx.patientId,
        doctorId: rx.doctorId,
        medications: rx.medications,
        status: rx.status || "pending",
        createdAt: rx.createdAt,
        dispensedAt: rx.dispensedAt || null,
        notes: rx.notes || "",
        patientName:
          rx.patientName ||
          patient?.name ||
          rx.patient_name ||
          "",
        patientPhone:
          rx.patientPhone ||
          patient?.phone ||
          rx.patient_phone ||
          "",
        nationalId:
          rx.nationalId ||
          patient?.nationalId ||
          rx.national_id ||
          "",
      };

      if (rx.id) {
        return {
          ...s,
          prescriptions: s.prescriptions.map((item) =>
            item.id === rx.id
              ? {
                  ...item,
                  ...clean,
                  id: item.id,
                  createdAt: item.createdAt || clean.createdAt || new Date().toISOString(),
                  patientName: clean.patientName || item.patientName || "",
                  patientPhone: clean.patientPhone || item.patientPhone || "",
                  nationalId: clean.nationalId || item.nationalId || "",
                }
              : item
          ),
        };
      }

      return {
        ...s,
        prescriptions: [
          {
            appointmentId: clean.appointmentId,
            patientId: clean.patientId,
            doctorId: clean.doctorId,
            medications: clean.medications,
            notes: clean.notes,
            patientName: clean.patientName,
            patientPhone: clean.patientPhone,
            nationalId: clean.nationalId,
            id: uid("rx"),
            status: clean.status,
            createdAt: new Date().toISOString(),
            dispensedAt: null,
          },
          ...s.prescriptions,
        ],
      };
    }),
  dispensePrescription: (id, options = {}) => {
    const {
      idLast4 = "",
      notes = "",
      pharmacistName = "الصيدلي",
      acknowledgeAllergy = false,
    } = options;

    const rx = refresh().prescriptions.find((item) => item.id === id);
    if (!rx) throw new Error("الوصفة غير موجودة");
    if (rx.status === "dispensed") throw new Error("تم صرف هذه الوصفة مسبقاً");

    const patient = careSystemStore.getPatient(rx.patientId);
    const nationalId = String(rx.nationalId || patient?.nationalId || "").replace(/\D/g, "");
    const phoneDigits = String(rx.patientPhone || patient?.phone || "").replace(/\D/g, "");
    const expected =
      nationalId.length >= 4
        ? nationalId.slice(-4)
        : phoneDigits.length >= 4
          ? phoneDigits.slice(-4)
          : "";

    if (!expected) {
      throw new Error("لا تتوفر هوية أو جوال للتحقق — راجع بيانات المريض");
    }
    if (String(idLast4).trim() !== expected) {
      throw new Error(
        nationalId.length >= 4
          ? "آخر 4 أرقام من رقم الهوية غير صحيحة"
          : "آخر 4 أرقام من رقم الجوال غير صحيحة"
      );
    }

    const profile = careSystemStore.getMedicalProfile(rx.patientId);
    const allergies = String(profile?.allergies || "").trim();
    const allergyHit = careSystemStore.findAllergyConflict(allergies, rx.medications);
    if (allergyHit && !acknowledgeAllergy) {
      throw new Error(`تحذير حساسية: ${allergyHit} — أكّد المتابعة للمتابعة بالصرف`);
    }

    const dispensedAt = new Date().toISOString();
    const patientName =
      rx.patientName || patient?.name || careSystemStore.resolveNames().patientName(rx.patientId);

    careSystemStore.savePrescription({
      ...rx,
      status: "dispensed",
      dispensedAt,
      readyAt: rx.readyAt || dispensedAt,
    });

    // خصم من المخزون حسب أسماء الأدوية المطابقة
    const stockResult = careSystemStore.consumeInventoryForMedications(rx.medications);

    update((s) => ({
      ...s,
      dispenseLogs: [
        {
          id: uid("dlog"),
          prescriptionId: rx.id,
          appointmentId: rx.appointmentId,
          patientId: rx.patientId,
          patientName,
          patientPhone: rx.patientPhone || patient?.phone || "",
          nationalId: rx.nationalId || patient?.nationalId || "",
          doctorId: rx.doctorId,
          medications: rx.medications,
          pharmacistName,
          notes: String(notes || "").trim(),
          verifyMethod: nationalId.length >= 4 ? "national_id" : "phone",
          allergyWarning: allergyHit || null,
          allergyOverridden: Boolean(allergyHit && acknowledgeAllergy),
          stockChanges: stockResult.changes,
          stockWarnings: stockResult.warnings,
          dispensedAt,
        },
        ...(s.dispenseLogs || []),
      ],
    }));

    // إشعار المريض أن الدواء تم صرفه / جاهز
    careSystemStore.notifyPatient({
      patientId: rx.patientId,
      type: "pharmacy",
      title: "تم صرف دوائك",
      body: `تم صرف وصفتك من الصيدلية (${patientName}). احتفظ بالإيصال للمراجعة.`,
      prescriptionId: rx.id,
    });

    if (rx.appointmentId) {
      careSystemStore.setAppointmentStatus(rx.appointmentId, "completed");
      careSystemStore.upsertVisit({
        appointmentId: rx.appointmentId,
        patientId: rx.patientId,
        doctorId: rx.doctorId,
        status: "completed",
        endedAt: dispensedAt,
      });
    }

    return { ...rx, status: "dispensed", dispensedAt, stockResult };
  },
  markPrescriptionReady: (id, { pharmacistName = "الصيدلي" } = {}) => {
    const rx = refresh().prescriptions.find((item) => item.id === id);
    if (!rx) throw new Error("الوصفة غير موجودة");
    if (rx.status === "dispensed") throw new Error("الوصفة مصروفة مسبقاً");

    const patient = careSystemStore.getPatient(rx.patientId);
    const patientName =
      rx.patientName || patient?.name || careSystemStore.resolveNames().patientName(rx.patientId);
    const readyAt = new Date().toISOString();

    careSystemStore.savePrescription({
      ...rx,
      status: "ready",
      readyAt,
      readyBy: pharmacistName,
    });

    careSystemStore.notifyPatient({
      patientId: rx.patientId,
      type: "pharmacy",
      title: "دواءك جاهز للاستلام",
      body: `وصفتك جاهزة في الصيدلية يا ${patientName}. يمكنك الحضور للاستلام.`,
      prescriptionId: rx.id,
    });

    return { ...rx, status: "ready", readyAt };
  },
  listDispenseLogs: () =>
    [...(refresh().dispenseLogs || [])].sort((a, b) =>
      String(b.dispensedAt || "").localeCompare(String(a.dispensedAt || ""))
    ),

  // Inventory
  listInventory: () =>
    [...(refresh().inventory || [])].sort((a, b) =>
      String(a.name).localeCompare(String(b.name), "ar")
    ),
  saveInventoryItem: (item) =>
    update((s) => {
      const clean = {
        id: item.id,
        name: String(item.name || "").trim(),
        keywords: Array.isArray(item.keywords)
          ? item.keywords
          : String(item.keywords || item.name || "")
              .split(/[,،]/)
              .map((k) => k.trim())
              .filter(Boolean),
        quantity: Math.max(0, Number(item.quantity) || 0),
        minQuantity: Math.max(0, Number(item.minQuantity) || 0),
        unit: item.unit || "علبة",
      };
      if (!clean.name) throw new Error("اسم الدواء مطلوب");

      if (item.id) {
        return {
          ...s,
          inventory: (s.inventory || []).map((row) =>
            row.id === item.id ? { ...row, ...clean, id: row.id } : row
          ),
        };
      }
      return {
        ...s,
        inventory: [{ ...clean, id: uid("inv") }, ...(s.inventory || [])],
      };
    }),
  adjustInventoryQuantity: (id, delta) =>
    update((s) => ({
      ...s,
      inventory: (s.inventory || []).map((row) =>
        row.id === id
          ? { ...row, quantity: Math.max(0, Number(row.quantity || 0) + Number(delta || 0)) }
          : row
      ),
    })),
  consumeInventoryForMedications: (medicationsText) => {
    const meds = String(medicationsText || "").toLowerCase();
    const changes = [];
    const warnings = [];
    if (!meds.trim()) return { changes, warnings };

    update((s) => {
      const inventory = (s.inventory || []).map((item) => {
        const keys = [item.name, ...(item.keywords || [])]
          .map((k) => String(k).toLowerCase().trim())
          .filter(Boolean);
        const matched = keys.some((key) => key.length >= 3 && meds.includes(key));
        if (!matched) return item;

        const nextQty = Math.max(0, Number(item.quantity || 0) - 1);
        changes.push({
          id: item.id,
          name: item.name,
          from: item.quantity,
          to: nextQty,
        });
        if (nextQty <= Number(item.minQuantity || 0)) {
          warnings.push(`${item.name} — الكمية منخفضة (${nextQty} ${item.unit || "علبة"})`);
        }
        if (item.quantity <= 0) {
          warnings.push(`${item.name} — غير متوفر في المخزون`);
        }
        return { ...item, quantity: nextQty };
      });
      return { ...s, inventory };
    });

    return { changes, warnings };
  },
  getLowStockItems: () =>
    careSystemStore
      .listInventory()
      .filter((item) => Number(item.quantity || 0) <= Number(item.minQuantity || 0)),

  // Patient notifications (pharmacy / system)
  notifyPatient: ({ patientId, title, body, type = "pharmacy", prescriptionId = null }) => {
    if (!patientId || !title || !body) return null;
    const item = {
      id: uid("pnot"),
      patientId,
      title,
      body,
      type,
      prescriptionId,
      createdAt: new Date().toISOString(),
      read: false,
    };
    update((s) => ({
      ...s,
      patientNotifications: [item, ...(s.patientNotifications || [])],
    }));
    return item;
  },
  listPatientNotifications: (patientId) =>
    [...(refresh().patientNotifications || [])]
      .filter((item) => !patientId || String(item.patientId) === String(patientId))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))),
  markPatientNotificationRead: (id) =>
    update((s) => ({
      ...s,
      patientNotifications: (s.patientNotifications || []).map((item) =>
        item.id === id ? { ...item, read: true } : item
      ),
    })),

  findAllergyConflict: (allergiesText, medicationsText) => {
    const allergies = String(allergiesText || "")
      .toLowerCase()
      .split(/[,،\/|-]+/)
      .map((part) => part.trim())
      .filter((part) => part && part !== "لا يوجد" && part !== "لا" && part !== "none");
    const meds = String(medicationsText || "").toLowerCase();
    if (!allergies.length || !meds) return null;

    const aliases = {
      أسبرين: ["أسبرين", "اسبرين", "aspirin", "asa"],
      بنسلين: ["بنسلين", "بنسيلين", "penicillin", "amoxicillin", "أموكسيسيلين"],
      سلفا: ["سلفا", "sulfa", "sulfonamide"],
      لاتكس: ["لاتكس", "latex"],
      ايبوبروفين: ["ايبوبروفين", "إيبوبروفين", "ibuprofen", "بروفين"],
    };

    for (const allergy of allergies) {
      const keys = aliases[allergy] || [allergy];
      for (const key of keys) {
        if (key.length >= 3 && meds.includes(key.toLowerCase())) {
          return allergy;
        }
      }
      if (allergy.length >= 3 && meds.includes(allergy)) {
        return allergy;
      }
    }
    return null;
  },

  // Appointment chat — doctor ↔ patient only
  listChatMessages: (appointmentId) =>
    refresh()
      .chatMessages.filter(
        (msg) =>
          String(msg.appointmentId) === String(appointmentId) &&
          (msg.senderRole === "doctor" || msg.senderRole === "patient")
      )
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt))),
  sendChatMessage: ({
    appointmentId,
    senderRole,
    senderName,
    body,
    id,
    createdAt,
  }) => {
    const text = String(body || "").trim();
    if (!appointmentId || !text) throw new Error("لا يمكن إرسال رسالة فارغة");
    if (senderRole !== "doctor" && senderRole !== "patient") {
      throw new Error("الدردشة متاحة بين الطبيب والمريض فقط");
    }

    // تجنّب تكرار نفس الرسالة عند الدمج من الـ API
    const existing = refresh().chatMessages || [];
    if (
      id &&
      existing.some((msg) => msg.id === id)
    ) {
      return existing.find((msg) => msg.id === id);
    }

    const message = {
      id: id || uid("msg"),
      appointmentId: String(appointmentId),
      senderRole,
      senderName:
        senderName || (senderRole === "doctor" ? "الطبيب" : "المريض"),
      body: text,
      createdAt: createdAt || new Date().toISOString(),
    };
    update((s) => ({
      ...s,
      chatMessages: [...(s.chatMessages || []), message],
    }));
    return message;
  },

  // Admin broadcasts — تصل للمستهدفين عبر جرس الإشعارات
  listBroadcasts: () =>
    [...(refresh().broadcasts || [])].sort((a, b) =>
      String(b.created_at || b.createdAt || "").localeCompare(
        String(a.created_at || a.createdAt || "")
      )
    ),
  saveBroadcast: ({ message, target, id, created_at, updated_at }) => {
    const text = String(message || "").trim();
    if (!text) throw new Error("اكتب نص الإعلان أولاً");
    const now = new Date().toISOString();
    const item = {
      id: id || uid("bc"),
      message: text,
      target: target || "all",
      created_at: created_at || now,
      updated_at: updated_at || now,
    };
    update((s) => {
      const exists = (s.broadcasts || []).some(
        (row) => String(row.id) === String(item.id)
      );
      if (exists) {
        return {
          ...s,
          broadcasts: s.broadcasts.map((row) =>
            String(row.id) === String(item.id) ? { ...row, ...item } : row
          ),
        };
      }
      return {
        ...s,
        broadcasts: [item, ...(s.broadcasts || [])],
      };
    });
    return item;
  },
  /** دمج قائمة من الـ API مع الإعلانات المحلية بدون تكرار */
  syncBroadcasts: (list = []) => {
    if (!Array.isArray(list) || list.length === 0) return refresh().broadcasts;
    update((s) => {
      const map = new Map();
      for (const row of s.broadcasts || []) {
        map.set(String(row.id), row);
      }
      for (const raw of list) {
        const item = {
          id: raw.id ?? uid("bc"),
          message: raw.message || "",
          target: raw.target || "all",
          created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
          updated_at: raw.updated_at || raw.updatedAt || raw.created_at || null,
        };
        if (!item.message) continue;
        map.set(String(item.id), { ...map.get(String(item.id)), ...item });
      }
      return {
        ...s,
        broadcasts: [...map.values()],
      };
    });
    return refresh().broadcasts;
  },
  deleteBroadcast: (id) =>
    update((s) => ({
      ...s,
      broadcasts: (s.broadcasts || []).filter((item) => String(item.id) !== String(id)),
    })),

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
  awaiting_radiology: "بانتظار الأشعة",
  results_ready: "نتائج جاهزة",
  awaiting_pharmacy: "بانتظار الصيدلية",
  completed: "مكتمل",
  cancelled: "ملغى",
};

export default careSystemStore;
