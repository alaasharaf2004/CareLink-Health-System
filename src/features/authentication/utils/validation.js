const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_HAS_LOWER = /[a-z]/;
const PASSWORD_HAS_UPPER = /[A-Z]/;
const PASSWORD_HAS_DIGIT = /\d/;
const PASSWORD_HAS_SYMBOL = /[$*!@#%^&()_+\-=[\]{};':"\\|,.<>/?`~]/;
const PHONE_REGEX = /^\d{9,10}$/;

export const MIN_NAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 8;
export const PHONE_MIN_LENGTH = 9;
export const PHONE_MAX_LENGTH = 10;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidFullName(name) {
  return name.trim().length >= MIN_NAME_LENGTH;
}

export function isValidPhone(phone) {
  return PHONE_REGEX.test(phone.replace(/\s/g, ""));
}

export function isValidPassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) return false;

  return (
    PASSWORD_HAS_LOWER.test(password) &&
    PASSWORD_HAS_UPPER.test(password) &&
    PASSWORD_HAS_DIGIT.test(password) &&
    PASSWORD_HAS_SYMBOL.test(password)
  );
}

export function passwordsMatch(password, confirmPassword) {
  return password.length > 0 && password === confirmPassword;
}

export function getSubmitButtonClass(isValid, extra = "") {
  return `rounded-xl text-sm font-bold text-white shadow-sm transition-all duration-200 active:scale-[0.98] ${extra} ${
    isValid
      ? "cursor-pointer bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-200/60"
      : "cursor-not-allowed bg-slate-300"
  }`;
}

export const PASSWORD_HINT =
  "8 أحرف على الأقل، حروف كبيرة وصغيرة، أرقام، ورموز مثل $ ، *";

export const PHONE_HINT = "9–10 أرقام بدون مسافات";

export const NAME_HINT = `3 أحرف على الأقل`;

export function sanitizePhoneInput(value) {
  return value.replace(/\D/g, "").slice(0, PHONE_MAX_LENGTH);
}

const NATIONAL_ID_REGEX = /^\d{9}$/;

export function isValidNationalId(value) {
  return NATIONAL_ID_REGEX.test(value.replace(/\s/g, ""));
}

export function sanitizeNationalIdInput(value) {
  return value.replace(/\D/g, "").slice(0, 9);
}

export function isValidAddress(value) {
  return value.trim().length >= 3;
}

export function isValidSpecialty(value) {
  return value.trim().length >= 2;
}

export function isValidYearsOfExperience(value) {
  const years = Number(value);
  return Number.isInteger(years) && years >= 0 && years <= 60;
}

export function sanitizeYearsInput(value) {
  return value.replace(/\D/g, "").slice(0, 2);
}

export const NATIONAL_ID_HINT = "9 أرقام";
