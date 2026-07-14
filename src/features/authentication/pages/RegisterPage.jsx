import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  User,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import CareLinkLogo from "../../../components/CareLinkLogo";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import GoogleAuthButton from "../components/GoogleAuthButton";
import GirlUserIcon from "../components/icons/GirlUserIcon";
import { useAuth } from "../context/AuthContext";
import { AUTH_CLICKABLE, AUTH_FORM_CARD_CLASS, AUTH_HERO_ALIGN } from "../constants/authForm";
import { getDashboardPath } from "../constants/authRoutes";
import {
  formatPhoneForApi,
  registerDoctor,
  registerPatient,
} from "../services/authService";
import { getApiErrorMessages } from "../../../lib/api/getApiErrorMessage";
import {
  getSubmitButtonClass,
  isValidAddress,
  isValidEmail,
  isValidFullName,
  isValidNationalId,
  isValidPassword,
  isValidPhone,
  isValidSpecialty,
  isValidYearsOfExperience,
  MIN_NAME_LENGTH,
  NAME_HINT,
  NATIONAL_ID_HINT,
  PASSWORD_HINT,
  passwordsMatch,
  PHONE_HINT,
  sanitizeNationalIdInput,
  sanitizePhoneInput,
  sanitizeYearsInput,
} from "../utils/validation";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const maxBirthDate = new Date().toISOString().split("T")[0];
const minBirthDate = "1920-01-01";

function RegisterPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [selectedRole, setSelectedRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+970");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [credentialDocument, setCredentialDocument] = useState(null);
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const isDoctor = selectedRole === "doctor";
  const isPasswordValid = isValidPassword(password);
  const isConfirmValid = passwordsMatch(password, confirmPassword);

  const isDoctorFieldsValid =
    !isDoctor ||
    (isValidSpecialty(specialty) &&
      isValidYearsOfExperience(yearsOfExperience) &&
      credentialDocument instanceof File);

  const isFormValid =
    isValidFullName(fullName) &&
    isValidEmail(email) &&
    isValidPhone(phone) &&
    isValidNationalId(nationalId) &&
    isValidAddress(address) &&
    gender &&
    birthDate &&
    isPasswordValid &&
    isConfirmValid &&
    agreedToTerms &&
    isDoctorFieldsValid;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessages([]);

    const payload = {
      name: fullName.trim(),
      email: email.trim(),
      password,
      phone: formatPhoneForApi(countryCode, phone),
      dateOfBirth: birthDate,
      nationalId: nationalId.trim(),
      address: address.trim(),
      gender,
      ...(isDoctor && {
        specialty: specialty.trim(),
        yearsOfExperience,
        credentialDocument,
      }),
    };

    try {
      const data = isDoctor
        ? await registerDoctor(payload)
        : await registerPatient(payload);

      const token =
        data?.access_token ?? data?.token ?? data?.data?.access_token ?? data?.data?.token;

      if (token) {
        setSession({ token, role: selectedRole });
        navigate(getDashboardPath(selectedRole), { replace: true });
        return;
      }

      navigate("/", {
        replace: true,
        state: {
          authRole: selectedRole,
          authMessage:
            data?.message ??
            (isDoctor
              ? "تم إرسال طلب التسجيل. بعد موافقة الإدارة يمكنك تسجيل الدخول كطبيب."
              : "تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن."),
        },
      });
    } catch (error) {
      setErrorMessages(
        getApiErrorMessages(error, "تعذر إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heroAlign={
        isDoctor ? AUTH_HERO_ALIGN.registerDoctor : AUTH_HERO_ALIGN.register
      }
    >
      <AuthCard className={AUTH_FORM_CARD_CLASS}>
        <div className="mb-6 flex justify-center opacity-0 animate-[formFadeUp_0.7s_ease_0.1s_forwards]">
          <CareLinkLogo size={42} showText layout="form" align="center" />
        </div>

        <div
          className="mb-6 text-center opacity-0 animate-[formFadeUp_0.7s_ease_0.15s_forwards]"
          dir="rtl"
        >
          <h1 className="text-2xl font-extrabold text-blue-950">إنشاء حساب جديد</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-slate-500">
            {isDoctor
              ? "أنشئ حسابك كطبيب وأرسل بياناتك وشهادتك للمراجعة من الإدارة"
              : "انضم إلينا وابدأ متابعة رعايتك الصحية من منصة واحدة"}
          </p>
        </div>

        {isDoctor && (
          <div
            dir="rtl"
            className="mb-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-right text-sm leading-6 text-amber-900 opacity-0 animate-[formFadeUp_0.7s_ease_0.18s_forwards]"
          >
            بعد التسجيل، قد يتطلب تسجيل الدخول موافقة الإدارة على طلبك.
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1 opacity-0 animate-[formFadeUp_0.7s_ease_0.2s_forwards]">
          <button
            type="button"
            onClick={() => setSelectedRole("doctor")}
            className={`${AUTH_CLICKABLE.roleTabBase} ${
              selectedRole === "doctor"
                ? AUTH_CLICKABLE.roleTabActive
                : AUTH_CLICKABLE.roleTabInactive
            }`}
          >
            <Stethoscope size={16} />
            طبيب
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("patient")}
            className={`${AUTH_CLICKABLE.roleTabBase} ${
              selectedRole === "patient"
                ? AUTH_CLICKABLE.roleTabActive
                : AUTH_CLICKABLE.roleTabInactive
            }`}
          >
            <User size={16} />
            مريض
          </button>
        </div>

        <form
          className="space-y-4 opacity-0 animate-[formFadeUp_0.7s_ease_0.3s_forwards]"
          dir="rtl"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">
                الاسم بالكامل
              </label>
              <div className="relative">
                <UserRound
                  size={17}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="أدخل اسمك بالكامل"
                  className={inputClass}
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">{NAME_HINT}</p>
              {fullName.trim() && !isValidFullName(fullName) && (
                <p className="mt-1 text-xs font-semibold text-red-500">
                  الاسم يجب أن يكون {MIN_NAME_LENGTH} أحرف على الأقل
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                  className={inputClass}
                />
              </div>
              {email.trim() && !isValidEmail(email) && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  أدخل بريداً إلكترونياً صحيحاً يحتوي على @
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">
                رقم الهاتف
              </label>
              <div
                dir="ltr"
                className="flex h-11 w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
              >
                <Phone size={17} className="ml-3.5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={countryCode}
                  onChange={(event) => {
                    const value = event.target.value.replace(/[^\d+]/g, "");
                    setCountryCode(value.startsWith("+") ? value : `+${value}`);
                  }}
                  placeholder="+970"
                  maxLength={6}
                  aria-label="مقدمة الدولة"
                  className="w-[4.75rem] shrink-0 border-0 bg-transparent px-1 text-center text-sm font-semibold text-slate-700 outline-none"
                />
                <span className="h-6 w-px shrink-0 bg-slate-200" aria-hidden="true" />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(event) => setPhone(sanitizePhoneInput(event.target.value))}
                  placeholder="أدخل رقم الهاتف"
                  className="min-w-0 flex-1 border-0 bg-transparent py-2.5 pl-2 pr-3.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">{PHONE_HINT}</p>
              {phone && !isValidPhone(phone) && (
                <p className="mt-1 text-xs font-semibold text-red-500">
                  أدخل رقماً صحيحاً من 9 إلى 10 أرقام
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">
                تاريخ الميلاد
              </label>
              <div className="relative" dir="rtl">
                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute right-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400"
                />
                {!birthDate && (
                  <span className="pointer-events-none absolute right-10 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-400">
                    يوم / شهر / سنة
                  </span>
                )}
                <input
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  min={minBirthDate}
                  max={maxBirthDate}
                  lang="ar"
                  className={`${inputClass} date-input-field cursor-pointer [color-scheme:light] ${
                    birthDate ? "" : "date-input-empty"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">
                رقم الهوية
              </label>
              <div className="relative" dir="ltr">
                <IdCard
                  size={17}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={nationalId}
                  onChange={(event) =>
                    setNationalId(sanitizeNationalIdInput(event.target.value))
                  }
                  placeholder="403789657"
                  className={inputClass}
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">{NATIONAL_ID_HINT}</p>
              {nationalId && !isValidNationalId(nationalId) && (
                <p className="mt-1 text-xs font-semibold text-red-500">
                  أدخل رقم هوية صحيحاً من 9 أرقام
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-800">
                العنوان
              </label>
              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="مثال: غزة، فلسطين"
                  className={inputClass}
                />
              </div>
              {address.trim() && !isValidAddress(address) && (
                <p className="mt-1 text-xs font-semibold text-red-500">
                  أدخل عنواناً من 3 أحرف على الأقل
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-bold text-slate-800">
                الجنس
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`${AUTH_CLICKABLE.genderBase} ${
                    gender === "male"
                      ? AUTH_CLICKABLE.genderMaleActive
                      : AUTH_CLICKABLE.genderMaleInactive
                  }`}
                >
                  <Users size={16} />
                  ذكر
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`${AUTH_CLICKABLE.genderBase} ${
                    gender === "female"
                      ? AUTH_CLICKABLE.genderFemaleActive
                      : AUTH_CLICKABLE.genderFemaleInactive
                  }`}
                >
                  <GirlUserIcon size={18} />
                  أنثى
                </button>
              </div>
            </div>

            {isDoctor && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    التخصص
                  </label>
                  <div className="relative">
                    <BriefcaseBusiness
                      size={17}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={specialty}
                      onChange={(event) => setSpecialty(event.target.value)}
                      placeholder="مثال: Cardiology"
                      className={inputClass}
                    />
                  </div>
                  {specialty.trim() && !isValidSpecialty(specialty) && (
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      أدخل التخصص من حرفين على الأقل
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    سنوات الخبرة
                  </label>
                  <div className="relative" dir="ltr">
                    <Clock3
                      size={17}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={yearsOfExperience}
                      onChange={(event) =>
                        setYearsOfExperience(sanitizeYearsInput(event.target.value))
                      }
                      placeholder="10"
                      className={inputClass}
                    />
                  </div>
                  {yearsOfExperience && !isValidYearsOfExperience(yearsOfExperience) && (
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      أدخل عدداً صحيحاً من 0 إلى 60
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-800">
                    ملف الشهادة / الاعتماد
                  </label>
                  <label className={AUTH_CLICKABLE.uploadLabel}>
                    <FileText size={18} className="shrink-0 text-blue-600" />
                    <span className="min-w-0 flex-1 text-sm text-slate-600">
                      {credentialDocument
                        ? credentialDocument.name
                        : "ارفع ملف PDF أو صورة للشهادة"}
                    </span>
                    <span className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
                      اختيار ملف
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
                      className="hidden"
                      onChange={(event) => {
                        setCredentialDocument(event.target.files?.[0] ?? null);
                      }}
                    />
                  </label>
                  <p className="mt-1.5 text-xs text-slate-400">
                    مطلوب لتسجيل الطبيب — PDF أو صورة
                  </p>
                </div>
              </>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock
                size={17}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="أدخل كلمة المرور"
                className={`${inputClass} pl-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={AUTH_CLICKABLE.iconButton}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">{PASSWORD_HINT}</p>
            {password && !isPasswordValid && (
              <p className="mt-1 text-xs font-semibold text-red-500">
                كلمة المرور لا تستوفي الشروط المطلوبة
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <Lock
                size={17}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                className={`${inputClass} pl-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={AUTH_CLICKABLE.iconButton}
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {confirmPassword && !isConfirmValid && (
              <p className="mt-1.5 text-xs font-semibold text-red-500">
                كلمتا المرور غير متطابقتين
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-start gap-2 text-sm leading-6 text-slate-600">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(event) => setAgreedToTerms(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
            />
            <span>
              أوافق على{" "}
              <Link to="#" className={`font-bold text-blue-600 ${AUTH_CLICKABLE.textLink} hover:underline`}>
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link to="#" className={`font-bold text-blue-600 ${AUTH_CLICKABLE.textLink} hover:underline`}>
                الخصوصية
              </Link>
            </span>
          </label>

          {errorMessages.length > 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              <p className="mb-1">يرجى تصحيح التالي:</p>
              <ul className="list-disc space-y-1 pr-5">
                {errorMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={getSubmitButtonClass(
              isFormValid && !isSubmitting,
              "flex h-11 w-full items-center justify-center gap-2"
            )}
          >
            <UserPlus size={17} />
            {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-4 opacity-0 animate-[formFadeUp_0.7s_ease_0.4s_forwards]">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">أو</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="opacity-0 animate-[formFadeUp_0.7s_ease_0.45s_forwards]">
          <GoogleAuthButton label="المتابعة بـ Google" />
        </div>

        <p
          className="mt-5 text-center text-sm text-slate-500 opacity-0 animate-[formFadeUp_0.7s_ease_0.5s_forwards]"
          dir="rtl"
        >
          لديك حساب بالفعل؟{" "}
          <Link to="/" className={AUTH_CLICKABLE.underlineLink}>
            تسجيل الدخول
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default RegisterPage;
