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
 * تسجيل الدخول حسب الدور: patient | doctor | admin
 * POST /api/{role}/login
 */
export async function login(role, { email, password }) {
  const response = await apiClient.post(
    `/${role}/login`,
    buildFormData({ email, password })
  );

  return response.data;
}

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
 * POST /api/patient/register
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
    "/patient/register",
    buildFormData({
      name,
      email,
      password,
      phone,
      date_of_birth: dateOfBirth,
      national_id: nationalId,
      address,
      gender,
    })
  );

  return response.data;
}

/**
 * إنشاء حساب طبيب
 * POST /api/doctor/register
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

  const response = await apiClient.post("/doctor/register", formData);

  return response.data;
}

/**
 * طلب رمز إعادة تعيين كلمة المرور
 * POST /api/{role}/forgot-password
 */
export async function forgotPassword(role, { email }) {
  const response = await apiClient.post(
    `/${role}/forgot-password`,
    buildFormData({ email })
  );

  return response.data;
}

/**
 * إعادة تعيين كلمة المرور بالرمز
 * POST /api/{role}/reset-password
 */
export async function resetPassword(
  role,
  { email, code, password, passwordConfirmation }
) {
  const response = await apiClient.post(
    `/${role}/reset-password`,
    buildFormData({
      email,
      code,
      password,
      password_confirmation: passwordConfirmation,
    })
  );

  return response.data;
}
