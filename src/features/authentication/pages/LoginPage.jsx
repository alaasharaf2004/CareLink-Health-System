import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Stethoscope, User } from "lucide-react";
import CareLinkLogo from "../../../components/CareLinkLogo";
import GoogleAuthButton from "../components/GoogleAuthButton";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";
import { AUTH_CLICKABLE, AUTH_FORM_CARD_CLASS, AUTH_HERO_ALIGN } from "../constants/authForm";
import { getDashboardPath } from "../constants/authRoutes";
import { login } from "../services/authService";
import { getSubmitButtonClass, isValidEmail } from "../utils/validation";
import { getApiErrorMessage } from "../../../lib/api/getApiErrorMessage";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const [selectedRole, setSelectedRole] = useState(
    location.state?.authRole === "patient" ? "patient" : "doctor"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginHint, setLoginHint] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.authMessage ?? ""
  );

  const isFormValid = isValidEmail(email) && password.trim().length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setLoginHint("");
    setSuccessMessage("");

    try {
      const data = await login(selectedRole, {
        email: email.trim(),
        password,
      });

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
    <AuthLayout heroAlign={AUTH_HERO_ALIGN.login}>
      <AuthCard className={AUTH_FORM_CARD_CLASS}>
        <div className="mb-6 flex justify-center opacity-0 animate-[formFadeUp_0.7s_ease_0.1s_forwards]">
          <CareLinkLogo size={42} showText layout="form" align="center" />
        </div>

        <div
          className="mb-6 text-center opacity-0 animate-[formFadeUp_0.7s_ease_0.15s_forwards]"
          dir="rtl"
        >
          <h1 className="text-2xl font-extrabold text-blue-950">مرحباً بعودتك</h1>
          <p className="mt-2 text-sm text-slate-500">
            سجل الدخول للوصول إلى حسابك ومتابعة خدماتك الصحية.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1 opacity-0 animate-[formFadeUp_0.7s_ease_0.25s_forwards]">
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
          className="space-y-4 opacity-0 animate-[formFadeUp_0.7s_ease_0.35s_forwards]"
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
            {email.trim() && !isValidEmail(email) && (
              <p className="mt-1.5 text-xs font-semibold text-red-500">
                أدخل بريداً إلكترونياً صحيحاً يحتوي على @
              </p>
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

          {errorMessage && (
            <div className="space-y-2">
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {errorMessage}
              </p>
              {loginHint && (
                <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                  {loginHint}
                </p>
              )}
            </div>
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

        <div className="my-5 flex items-center gap-4 opacity-0 animate-[formFadeUp_0.7s_ease_0.45s_forwards]">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-sm text-slate-400">أو</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="opacity-0 animate-[formFadeUp_0.7s_ease_0.5s_forwards]">
          <GoogleAuthButton label="تسجيل الدخول باستخدام Google" />
        </div>

        <p
          className="mt-5 text-center text-sm text-slate-500 opacity-0 animate-[formFadeUp_0.7s_ease_0.55s_forwards]"
          dir="rtl"
        >
          ليس لديك حساب؟{" "}
          <Link to="/register" className={AUTH_CLICKABLE.underlineLink}>
            إنشاء حساب جديد
          </Link>
        </p>

        <p
          className="mt-3 text-center text-xs text-slate-400 opacity-0 animate-[formFadeUp_0.7s_ease_0.6s_forwards]"
          dir="rtl"
        >
          <Link to="/admin/login" className={`font-semibold ${AUTH_CLICKABLE.textLink}`}>
            دخول الإدارة
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default LoginPage;
