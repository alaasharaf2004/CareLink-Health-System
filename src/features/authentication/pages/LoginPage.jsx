import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  FlaskConical,
  Lock,
  Mail,
  Pill,
  Scan,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
} from "lucide-react";

import CareLinkLogo from "../../../components/CareLinkLogo";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";
import { AUTH_CLICKABLE, AUTH_FORM_ALIGN, AUTH_FORM_CARD_CLASS, AUTH_HERO_ALIGN, AUTH_HERO_NUDGE } from "../constants/authForm";
import { getDashboardPath } from "../constants/authRoutes";
import { login, loginAdmin } from "../services/authService";
import { getSubmitButtonClass, isValidEmail } from "../utils/validation";
import { getApiErrorMessage } from "../../../lib/api/getApiErrorMessage";
import { DEMO_ACCOUNTS, tryDemoLogin } from "../../care-system/data/careSystemStore";

const CATEGORIES = [
  {
    id: "public",
    title: "مريض / طبيب",
    description: "حجز مواعيد ومتابعة الملف الطبي",
    icon: User,
    roles: [
      { value: "patient", label: "مريض", icon: User },
      { value: "doctor", label: "طبيب", icon: Stethoscope },
    ],
  },
  {
    id: "staff",
    title: "طاقم العيادة",
    description: "استقبال، مختبر، صيدلية، وأشعة",
    icon: Users,
    roles: [
      { value: "reception", label: "موظف استقبال", icon: Users },
      { value: "laboratory", label: "فني مختبر", icon: FlaskConical },
      { value: "pharmacy", label: "صيدلي", icon: Pill },
      { value: "radiology", label: "فني أشعة", icon: Scan },
    ],
  },
  {
    id: "admin",
    title: "أدمن",
    description: "إدارة النظام والصلاحيات",
    icon: ShieldCheck,
    roles: [{ value: "admin", label: "إدارة", icon: ShieldCheck }],
  },
];

const ROLE_LABELS = {
  patient: "المريض",
  doctor: "الطبيب",
  reception: "موظف الاستقبال",
  laboratory: "فني المختبر",
  pharmacy: "الصيدلي",
  radiology: "فني الأشعة",
  admin: "الإدارة",
};

const STAFF_ROLES = ["reception", "laboratory", "pharmacy", "radiology"];

function resolveCategoryFromRole(role) {
  return CATEGORIES.find((category) =>
    category.roles.some((item) => item.value === role)
  )?.id;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();

  const roleFromState = Object.keys(ROLE_LABELS).includes(location.state?.authRole)
    ? location.state.authRole
    : null;

  const [step, setStep] = useState(roleFromState ? "form" : "category");
  const [categoryId, setCategoryId] = useState(
    roleFromState ? resolveCategoryFromRole(roleFromState) : null
  );
  const [selectedRole, setSelectedRole] = useState(roleFromState);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginHint, setLoginHint] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.authMessage ?? ""
  );

  const category = useMemo(
    () => CATEGORIES.find((item) => item.id === categoryId) || null,
    [categoryId]
  );

  const isFormValid = isValidEmail(email) && password.trim().length > 0;
  const demoAccount = DEMO_ACCOUNTS.find((item) => item.role === selectedRole);
  const showRoleTabs = category?.roles?.length > 1;

  const openCategory = (nextCategory) => {
    setCategoryId(nextCategory.id);
    setSelectedRole(nextCategory.roles[0].value);
    setStep("form");
    setErrorMessage("");
    setLoginHint("");
    setSuccessMessage("");
    setEmail("");
    setPassword("");
  };

  const backToCategories = () => {
    setStep("category");
    setCategoryId(null);
    setSelectedRole(null);
    setErrorMessage("");
    setLoginHint("");
    setSuccessMessage("");
  };

  const finishLogin = (account) => {
    setSession({
      token: `demo-${account.role}-token`,
      role: account.role,
      profile: {
        email: account.email,
        name: account.name,
        staffId: account.staffId,
        patientId: account.patientId,
        profile_picture: account.profile_picture || null,
        mustChangePassword: Boolean(account.mustChangePassword),
      },
    });

    if (account.mustChangePassword) {
      navigate("/change-password", { replace: true });
      return;
    }

    navigate(getDashboardPath(account.role), { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedRole || !isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setLoginHint("");
    setSuccessMessage("");

    try {
      const demo = tryDemoLogin(email, password, selectedRole);
      if (demo) {
        finishLogin(demo);
        return;
      }

      if (STAFF_ROLES.includes(selectedRole)) {
        setErrorMessage(
          "الحساب غير موجود أو كلمة المرور خاطئة. تأكد أن الأدمن أنشأ لك حساباً أو استخدم الحساب التجريبي."
        );
        return;
      }

      const data =
        selectedRole === "admin"
          ? await loginAdmin({ email: email.trim(), password })
          : await login(selectedRole, { email: email.trim(), password });

      const token =
        data?.access_token ?? data?.token ?? data?.data?.access_token ?? data?.data?.token;

      const user = data?.user ?? data?.admin ?? data?.data?.user ?? {};

      if (token) {
        setSession({
          token,
          role: selectedRole,
          profile: {
            email: user.email || email,
            name: user.name || "مستخدم",
            staffId: user.id || null,
            patientId: null,
            profile_picture: user.profile_picture || null,
          },
        });
        navigate(getDashboardPath(selectedRole), { replace: true });
        return;
      }

      setSuccessMessage(data?.message ?? "تم تسجيل الدخول بنجاح.");
    } catch (error) {
      setErrorMessage(
        error?.message ||
          getApiErrorMessage(error, "تعذر تسجيل الدخول. تحقق من البيانات وحاول مرة أخرى.")
      );

      if (selectedRole === "doctor" && error?.response?.status === 401) {
        setLoginHint(
          "إذا أنشأت حساب طبيب للتو، قد يكون الحساب بانتظار موافقة الإدارة."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heroAlign={AUTH_HERO_ALIGN.simple}
      heroNudgeClass={AUTH_HERO_NUDGE.admin}
      formAlign={AUTH_FORM_ALIGN.end}
    >
      <AuthCard className={AUTH_FORM_CARD_CLASS}>
        <div className="mb-6 flex justify-center opacity-0 animate-[logoReveal_0.75s_cubic-bezier(0.22,1,0.36,1)_0.05s_forwards]">
          <CareLinkLogo size={44} showText layout="form" align="center" />
        </div>

        {step === "category" ? (
          <div dir="rtl" key="category" className="opacity-0 animate-[loginStepIn_0.55s_cubic-bezier(0.22,1,0.36,1)_0.12s_forwards]">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-blue-950">
                تسجيل الدخول
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                اختر فئة الدخول المناسبة، ثم أكمل بيانات الحساب.
              </p>
            </div>

            <div className="space-y-3">
              {CATEGORIES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openCategory(item)}
                    style={{ animationDelay: `${0.18 + index * 0.09}s` }}
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/90 bg-gradient-to-l from-white to-slate-50/80 px-4 py-4 text-right opacity-0 shadow-[0_1px_0_rgba(15,23,42,0.03)] animate-[loginCategoryIn_0.65s_cubic-bezier(0.22,1,0.36,1)_forwards] transition-all duration-300 hover:-translate-y-1 hover:border-[#40C0A0]/45 hover:from-white hover:to-[#40C0A0]/8 hover:shadow-[0_12px_28px_rgba(16,24,96,0.08)]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#101860]/6 text-[#101860] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#40C0A0]/15 group-hover:text-[#101860]">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 overflow-hidden">
                      <span className="block truncate text-sm font-extrabold text-[#101860]">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs leading-5 text-slate-500 transition-colors group-hover:text-slate-600">
                        {item.description}
                      </span>
                    </span>
                    <span className="inline-flex h-9 w-[4.25rem] shrink-0 items-center justify-center rounded-lg border border-blue-200/90 bg-white text-xs font-bold text-blue-600 transition-all duration-300 group-hover:border-[#101860] group-hover:bg-[#101860] group-hover:text-white group-hover:shadow-sm">
                      دخول
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-center text-sm leading-6 text-slate-500 opacity-0 animate-[formFadeUp_0.6s_ease_0.55s_forwards]">
              ليس لديك حساب مريض/طبيب؟{" "}
              <Link to="/register" className={AUTH_CLICKABLE.underlineLink}>
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        ) : (
          <div key="form" className="opacity-0 animate-[loginStepIn_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]">
            <div className="mb-5 text-center" dir="rtl">
              <button
                type="button"
                onClick={backToCategories}
                className={`mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 ${AUTH_CLICKABLE.textLink}`}
              >
                <ArrowRight size={15} />
                العودة لاختيار الفئة
              </button>
              <h1 className="text-2xl font-extrabold text-blue-950">
                دخول {category?.title || ROLE_LABELS[selectedRole]}
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {category?.description || "أدخل بيانات حسابك للمتابعة."}
              </p>
            </div>

            {showRoleTabs && (
              <div
                className={`mb-5 grid gap-1.5 rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 ${
                  category.roles.length >= 4
                    ? "grid-cols-2"
                    : category.roles.length === 3
                      ? "grid-cols-3"
                      : "grid-cols-2"
                }`}
              >
                {category.roles.map(({ value, label, icon: Icon }) => {
                  const isActive = selectedRole === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSelectedRole(value);
                        setErrorMessage("");
                        setLoginHint("");
                      }}
                      className={`flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 text-[11px] font-bold transition-all duration-300 sm:gap-2 sm:text-sm ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-200/70"
                          : "bg-transparent text-slate-600 hover:bg-white hover:text-blue-700"
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            <form className="space-y-4" dir="rtl" onSubmit={handleSubmit}>
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
                    placeholder="أدخل بريدك الإلكتروني"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none transition duration-300 placeholder:text-slate-400 focus:border-[#40C0A0] focus:ring-4 focus:ring-[#40C0A0]/15"
                  />
                </div>
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
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-10 text-sm text-slate-700 outline-none transition duration-300 placeholder:text-slate-400 focus:border-[#40C0A0] focus:ring-4 focus:ring-[#40C0A0]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={AUTH_CLICKABLE.iconButton}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {(selectedRole === "patient" || selectedRole === "doctor") && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2 font-semibold text-slate-700">
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#101860]" />
                    تذكرني
                  </label>
                  <Link
                    to="/forgot-password"
                    state={{ authRole: selectedRole }}
                    className={AUTH_CLICKABLE.underlineLink}
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              )}

              {errorMessage && (
                <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {errorMessage}
                </p>
              )}
              {loginHint && (
                <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                  {loginHint}
                </p>
              )}
              {successMessage && (
                <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {successMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={getSubmitButtonClass(isFormValid && !isSubmitting, "h-11 w-full")}
              >
                {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
            </form>

            {demoAccount && (
              <>
                <button
                  type="button"
                  onClick={() => finishLogin(demoAccount)}
                  className={`${AUTH_CLICKABLE.roleTabBase} mt-3 w-full border border-dashed border-[#40C0A0]/50 bg-[#40C0A0]/10 text-[#101860] hover:bg-[#40C0A0]/18`}
                >
                  دخول تجريبي — {ROLE_LABELS[selectedRole]}
                </button>
                <p className="mt-2 text-center text-[11px] leading-5 text-slate-400" dir="ltr">
                  {demoAccount.email} / {demoAccount.password}
                </p>
              </>
            )}

            {(selectedRole === "patient" || selectedRole === "doctor") && (
              <>
                <div className="my-5 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-sm text-slate-400">أو</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <GoogleAuthButton label="تسجيل الدخول باستخدام Google" />
                <p className="mt-5 text-center text-sm text-slate-500" dir="rtl">
                  ليس لديك حساب؟{" "}
                  <Link to="/register" className={AUTH_CLICKABLE.underlineLink}>
                    إنشاء حساب جديد
                  </Link>
                </p>
              </>
            )}
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;