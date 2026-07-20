import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import CareLinkLogo from "../../../components/CareLinkLogo";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import OTPInput from "../components/OTPInput";
import ResendTimer from "../components/ResendTimer";
import {
  AUTH_CLICKABLE,
  AUTH_BODY_ANIM,
  AUTH_FORM_ALIGN,
  AUTH_FORM_CARD_CLASS,
  AUTH_HERO_ALIGN,
  AUTH_HERO_NUDGE,
  AUTH_LOGO_ANIM,
  AUTH_STEP_ANIM,
} from "../constants/authForm";
import {
  maskEmail,
  readPasswordResetDraft,
  savePasswordResetDraft,
} from "../constants/authPasswordReset";
import { forgotPassword } from "../services/authService";
import { getApiErrorMessage } from "../../../lib/api/getApiErrorMessage";
import { getSubmitButtonClass } from "../utils/validation";

const OTP_LENGTH = 5;
const RESEND_SECONDS = 60;

function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const draft = readPasswordResetDraft();
  const email = location.state?.email ?? draft?.email ?? "";
  const role = location.state?.role ?? draft?.role ?? "patient";

  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState(location.state?.authMessage ?? "");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
      return;
    }

    savePasswordResetDraft({ email, role });
  }, [email, role, navigate]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const data = await forgotPassword(role, { email });
      setCode("");
      setSecondsLeft(RESEND_SECONDS);
      setCanResend(false);
      setInfoMessage(data?.message ?? "تم إرسال رمز جديد إلى بريدك.");
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, "تعذر إعادة إرسال الرمز. حاول لاحقاً.")
      );
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = code.length === OTP_LENGTH;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isComplete) return;

    savePasswordResetDraft({ email, role, code });

    navigate("/reset-password", {
      state: { email, role, code },
    });
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout
      heroAlign={AUTH_HERO_ALIGN.simple}
      heroNudgeClass={AUTH_HERO_NUDGE.admin}
      formAlign={AUTH_FORM_ALIGN.end}
    >
      <AuthCard className={AUTH_FORM_CARD_CLASS}>
        <div className={`mb-6 flex justify-center ${AUTH_LOGO_ANIM}`}>
          <CareLinkLogo size={44} showText layout="form" align="center" />
        </div>

        <div className={`mb-6 text-center ${AUTH_STEP_ANIM}`} dir="rtl">
          <h1 className="text-2xl font-extrabold text-[#101860]">
            التحقق من الرمز
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-slate-500">
            أدخل الرمز المكوّن من {OTP_LENGTH} أرقام المرسل إلى{" "}
            <span className="font-bold text-slate-700" dir="ltr">
              {maskEmail(email)}
            </span>
          </p>
        </div>

        <form
          className={`space-y-5 ${AUTH_BODY_ANIM}`}
          dir="rtl"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-3 block text-center text-sm font-bold text-slate-800">
              رمز التحقق
            </label>
            <OTPInput length={OTP_LENGTH} value={code} onChange={setCode} />
          </div>

          <ResendTimer
            secondsLeft={secondsLeft}
            totalSeconds={RESEND_SECONDS}
            canResend={canResend && !isResending}
            onResend={handleResend}
          />

          {infoMessage && (
            <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {infoMessage}
            </p>
          )}

          {errorMessage && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={!isComplete}
            className={getSubmitButtonClass(
              isComplete,
              "flex h-11 w-full items-center justify-center gap-2"
            )}
          >
            <ShieldCheck size={16} />
            تأكيد الرمز
          </button>
        </form>

        <p
          className={`mt-6 text-center text-sm text-slate-500 ${AUTH_BODY_ANIM}`}
          dir="rtl"
        >
          <Link
            to="/forgot-password"
            state={{ authRole: role }}
            className={`inline-flex items-center justify-center gap-1.5 font-bold text-blue-600 ${AUTH_CLICKABLE.textLink}`}
          >
            <ArrowRight size={16} />
            العودة لإدخال البريد
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default VerifyCodePage;
