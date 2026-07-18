import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import CareLinkLogo from "../../../components/CareLinkLogo";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";
import {
  AUTH_CLICKABLE,
  AUTH_FORM_ALIGN,
  AUTH_FORM_CARD_CLASS,
  AUTH_HERO_ALIGN,
  AUTH_HERO_NUDGE,
} from "../constants/authForm";
import { getDashboardPath } from "../constants/authRoutes";
import { loginAdmin } from "../services/authService";
import { getApiErrorMessage } from "../../../lib/api/getApiErrorMessage";
import { getSubmitButtonClass, isValidEmail } from "../utils/validation";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function AdminLoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = isValidEmail(email) && password.trim().length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = await loginAdmin({
        email: email.trim(),
        password,
      });

      const token =
        data?.access_token ?? data?.token ?? data?.data?.access_token ?? data?.data?.token;

      if (!token) {
        throw new Error("لم يتم استلام رمز الدخول من السيرفر.");
      }

      setSession({ token, role: "admin" });
      navigate(getDashboardPath("admin"), { replace: true });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "تعذر تسجيل دخول الإدارة. تحقق من البيانات.")
      );
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

        <div
          className="mb-6 text-center opacity-0 animate-[formFadeUp_0.7s_ease_0.15s_forwards]"
          dir="rtl"
        >
          <h1 className="text-2xl font-extrabold text-blue-950">دخول الإدارة</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-slate-500">
            سجّل الدخول بحساب المسؤول لإدارة النظام والأطباء والإعلانات.
          </p>
        </div>

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
                placeholder="admin@gmail.com"
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
          </div>

          {errorMessage && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={getSubmitButtonClass(
              isFormValid && !isSubmitting,
              "flex h-11 w-full items-center justify-center gap-2"
            )}
          >
            <ShieldCheck size={16} />
            {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <p
          className="mt-6 text-center text-sm text-slate-500 opacity-0 animate-[formFadeUp_0.7s_ease_0.35s_forwards]"
          dir="rtl"
        >
          <Link
            to="/login"
            className={`inline-flex items-center justify-center gap-1.5 font-bold text-blue-600 ${AUTH_CLICKABLE.textLink}`}
          >
            العودة لتسجيل دخول المريض / الطبيب
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400" dir="rtl">
          <Link to="/staff/login" className={`font-semibold ${AUTH_CLICKABLE.textLink}`}>
            دخول الموظفين
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default AdminLoginPage;
