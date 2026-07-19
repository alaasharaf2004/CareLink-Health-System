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
    description: "استقبال، مختبر، وصيدلية",
    icon: Users,
    roles: [
      { value: "reception", label: "استقبال", icon: Users },
      { value: "laboratory", label: "مختبر", icon: FlaskConical },
      { value: "pharmacy", label: "صيدلية", icon: Pill },
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
  reception: "الاستقبال",
  laboratory: "المختبر",
  pharmacy: "الصيدلية",
  admin: "الإدارة",
};

const STAFF_ROLES = ["reception", "laboratory", "pharmacy"];

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
      },
    });
    navigate(getDashboardPath(account.role), { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedRole || !isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setLoginHint("");
    setSuccessMessage("");

    // const demo = tryDemoLogin(email, password, selectedRole);
    // if (demo) {
    //   finishLogin(demo);
    //   setIsSubmitting(false);
    //   return;
    // }

    if (STAFF_ROLES.includes(selectedRole)) {
      setErrorMessage("استخدم الحساب التجريبي الظاهر أسفل النموذج لهذا الدور حالياً.");
      setIsSubmitting(false);
      return;
    }

    try {
      const data =
        selectedRole === "admin"
          ? await loginAdmin({ email: email.trim(), password })
          : await login(selectedRole, { email: email.trim(), password });

      const token =
        data?.access_token ?? data?.token ?? data?.data?.access_token ?? data?.data?.token;

      if (token) {
        setSession({ token, role: selectedRole });
        navigate(getDashboardPath(selectedRole), { replace: true });
        return;
      }

      setSuccessMessage(data?.message ?? "تم تسجيل الدخول بنجاح.");
    } catch (error) {
      setErrorMessage(
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
      formAlign={AUTH_FORM_ALIGN.center}
    >
      <AuthCard className={AUTH_FORM_CARD_CLASS}>
        <div className="mb-6 flex justify-center opacity-0 animate-[formFadeUp_0.7s_ease_0.1s_forwards]">
          <CareLinkLogo size={42} showText layout="form" align="center" />
        </div>

        {step === "category" ? (
          <div dir="rtl" className="opacity-0 animate-[formFadeUp_0.7s_ease_0.15s_forwards]">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-extrabold text-blue-950">تسجيل الدخول</h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-slate-500">
                اختر فئة الدخول المناسبة، ثم أكمل بيانات الحساب.
              </p>
            </div>

            <div className="space-y-3">
              {CATEGORIES.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openCategory(item)}
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-right transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm hover:shadow-blue-100/70"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold text-blue-950">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                        {item.description}
                      </span>
                    </span>
                    <span className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                      دخول
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              ليس لديك حساب مريض/طبيب؟{" "}
              <Link to="/register" className={AUTH_CLICKABLE.underlineLink}>
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        ) : (
          <>
            <div
              className="mb-5 text-center opacity-0 animate-[formFadeUp_0.7s_ease_0.15s_forwards]"
              dir="rtl"
            >
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
                className={`mb-5 grid gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 opacity-0 animate-[formFadeUp_0.7s_ease_0.2s_forwards] ${
                  category.roles.length === 3 ? "grid-cols-3" : "grid-cols-2"
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
                      className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-200/70"
                          : "bg-transparent text-blue-950 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            <form
              className="space-y-4 opacity-0 animate-[formFadeUp_0.7s_ease_0.25s_forwards]"
              dir="rtl"
              onSubmit={handleSubmit}
            >
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
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-600" />
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
                  className={`${AUTH_CLICKABLE.roleTabBase} mt-3 w-full border border-dashed border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-50`}
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
          </>
        )}
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;
