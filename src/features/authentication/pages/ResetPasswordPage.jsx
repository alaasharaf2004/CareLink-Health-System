import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import CareLinkLogo from "../../../components/CareLinkLogo";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import {
  AUTH_CLICKABLE,
  AUTH_FORM_CARD_CLASS,
  AUTH_HERO_ALIGN,
} from "../constants/authForm";
import {
  clearPasswordResetDraft,
  readPasswordResetDraft,
} from "../constants/authPasswordReset";
import { resetPassword } from "../services/authService";
import { getApiErrorMessage } from "../../../lib/api/getApiErrorMessage";
import {
  getSubmitButtonClass,
  isValidPassword,
  PASSWORD_HINT,
  passwordsMatch,
} from "../utils/validation";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const draft = readPasswordResetDraft();
  const email = location.state?.email ?? draft?.email ?? "";
  const role = location.state?.role ?? draft?.role ?? "patient";
  const code = location.state?.code ?? draft?.code ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isPasswordValid = isValidPassword(password);
  const isConfirmValid = passwordsMatch(password, confirmPassword);
  const isFormValid = isPasswordValid && isConfirmValid;

  useEffect(() => {
    if (!email || !code) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, code, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting || !email || !code) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const data = await resetPassword(role, {
        email,
        code,
        password,
        passwordConfirmation: confirmPassword,
      });

      clearPasswordResetDraft();

      navigate("/", {
        replace: true,
        state: {
          authRole: role,
          authMessage:
            data?.message ??
            "تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.",
        },
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "تعذر حفظ كلمة المرور. تحقق من الرمز وحاول مرة أخرى."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email || !code) {
    return null;
  }

  return (
    <AuthLayout heroAlign={AUTH_HERO_ALIGN.simple}>
      <AuthCard className={AUTH_FORM_CARD_CLASS}>
        <div className="mb-6 flex justify-center opacity-0 animate-[formFadeUp_0.7s_ease_0.1s_forwards]">
          <CareLinkLogo size={42} showText layout="form" align="center" />
        </div>

        <div
          className="mb-6 text-center opacity-0 animate-[formFadeUp_0.7s_ease_0.15s_forwards]"
          dir="rtl"
        >
          <h1 className="text-2xl font-extrabold text-blue-950">
            إعادة تعيين كلمة المرور
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-slate-500">
            اختر كلمة مرور جديدة قوية لحسابك
          </p>
        </div>

        <form
          className="space-y-4 opacity-0 animate-[formFadeUp_0.7s_ease_0.25s_forwards]"
          dir="rtl"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              كلمة المرور الجديدة
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
                placeholder="أدخل كلمة المرور الجديدة"
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
            {isSubmitting ? "جاري الحفظ..." : "حفظ كلمة المرور"}
          </button>
        </form>

        <p
          className="mt-6 text-center text-sm text-slate-500 opacity-0 animate-[formFadeUp_0.7s_ease_0.35s_forwards]"
          dir="rtl"
        >
          <Link
            to="/"
            className={`inline-flex items-center justify-center gap-1.5 font-bold text-blue-600 ${AUTH_CLICKABLE.textLink}`}
          >
            <ArrowRight size={16} />
            العودة لتسجيل الدخول
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
