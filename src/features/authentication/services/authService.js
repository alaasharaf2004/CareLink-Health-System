import apiClient from "../../../lib/api/client";

function buildFormData(fields) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, value);
  });

  return formData;
}

/**
 * تسجيل الدخول حسب الدور: patient | doctor | admin | reception | laboratory | pharmacy
 */
/**
 * تسجيل الدخول حسب الدور: patient | doctor | admin | reception | laboratory | pharmacy
 */
export async function login(role, { email, password }) {
  // إذا كان الدور أحد أدوار طاقم العيادة، نوجهه للمسار الخاص به في الباك إند
  if (["reception", "laboratory", "pharmacy"].includes(role)) {
    const response = await apiClient.post(
      `/auth/staff/login`,
      buildFormData({ email, password, role })
    );
    return response.data;
  }

  // للأدوار الأخرى (patient, doctor)
  const response = await apiClient.post(
    `/auth/${role}/login`,
    buildFormData({ email, password })
  );

  return response.data;
}
// export async function login(role, { email, password }) {
//   const response = await apiClient.post(
//     `/auth/${role}/login`,
//     buildFormData({ email, password })
//   );

//   return response.data;
// }

export function formatPhoneForApi(countryCode, phone) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0")) {
    return digits;
  }

  if (countryCode === "+970" && digits.length === 9) {
    return `0${digits}`;
  }

  return `${countryCode.replace("+", "")}${digits}`;
}

/**
 * إنشاء حساب مريض
 * POST /api/auth/patient/register
 */
export async function registerPatient({
  name,
  email,
  password,
  phone,
  dateOfBirth,
  nationalId,
  address,
  gender,
}) {
  const response = await apiClient.post(
    "/auth/patient/register",
    buildFormData({
      name,
      email,
      password,
      phone,
      date_of_birth: dateOfBirth,
      national_id: nationalId,
      address,
      gender,
    }),
  );

  return response.data;
}

/**
 * إنشاء حساب طبيب
 * POST /api/auth/doctor/register
 */
export async function registerDoctor({
  name,
  email,
  password,
  phone,
  dateOfBirth,
  nationalId,
  address,
  gender,
  specialty,
  yearsOfExperience,
  credentialDocument,
}) {
  const formData = buildFormData({
    name,
    email,
    password,
    phone,
    date_of_birth: dateOfBirth,
    national_id: nationalId,
    address,
    gender,
    specialty,
    years_of_experience: yearsOfExperience,
  });

  if (credentialDocument instanceof File) {
    formData.append("credential_document", credentialDocument);
  }

  const response = await apiClient.post("/auth/doctor/register", formData);

  return response.data;
}

/**
 * طلب رمز إعادة تعيين كلمة المرور
 * POST /api/auth/{role}/forgot-password
 */
export async function forgotPassword(role, { email }) {
  const response = await apiClient.post(
    `/auth/${role}/forgot-password`,
    buildFormData({ email }),
  );

  return response.data;
}

/**
 * إعادة تعيين كلمة المرور بالرمز
 * POST /api/auth/{role}/reset-password
 */
export async function resetPassword(
  role,
  { email, code, password, passwordConfirmation },
) {
  const response = await apiClient.post(
    `/auth/${role}/reset-password`,
    buildFormData({
      email,
      code,
      password,
      password_confirmation: passwordConfirmation,
    }),
  );

  return response.data;
}

/**
 * تسجيل دخول الإدارة
 * POST /api/auth/admin/login
 */
export async function loginAdmin({ email, password }) {
  return login("admin", { email, password });
}

/**
 * قائمة جميع الأدمن
 * GET /api/auth/admin/list
 */
export async function getAllAdmins() {
  const response = await apiClient.get("/auth/admin/list");
  return response.data;
}

/**
 * قائمة جميع المرضى (للإدارة)
 * GET /api/auth/admin/patients
 */
export async function getAllPatients() {
  const response = await apiClient.get("/auth/admin/patients");
  return response.data;
}
