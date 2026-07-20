import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, FlaskConical, Lock, Mail, Pill, Scan, Users } from "lucide-react";

import CareLinkLogo from "../../../components/CareLinkLogo";
import AuthLayout from "../components/AuthLayout";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";
import {
  AUTH_CLICKABLE,
  AUTH_FORM_ALIGN,
  AUTH_FORM_CARD_CLASS,
  AUTH_BODY_ANIM,
  AUTH_HERO_ALIGN,
  AUTH_HERO_NUDGE,
  AUTH_LOGO_ANIM,
  AUTH_STEP_ANIM,
} from "../constants/authForm";
import { getDashboardPath } from "../constants/authRoutes";
import { getSubmitButtonClass, isValidEmail } from "../utils/validation";
import { DEMO_ACCOUNTS, tryDemoLogin } from "../../care-system/data/careSystemStore";

const STAFF_ROLES = [
  { value: "reception", label: "موظف استقبال", icon: Users },
  { value: "laboratory", label: "فني مختبر", icon: FlaskConical },
  { value: "pharmacy", label: "صيدلي", icon: Pill },
  { value: "radiology", label: "فني أشعة", icon: Scan },
];

const ROLE_LABELS = {
  reception: "موظف الاستقبال",
  laboratory: "فني المختبر",
  pharmacy: "الصيدلي",
  radiology: "فني الأشعة",
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function StaffLoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [selectedRole, setSelectedRole] = useState("reception");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = isValidEmail(email) && password.trim().length > 0;
  const demoAccount = DEMO_ACCOUNTS.find((item) => item.role === selectedRole);

  const finishLogin = (account) => {
    setSession({
      token: `demo-${account.role}-token`,
      role: account.role,
      profile: {
        email: account.email,
        name: account.name,
        staffId: account.staffId,
        patientId: null,
      },
    });
    navigate(getDashboardPath(account.role), { replace: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const demo = tryDemoLogin(email, password, selectedRole);
    if (demo) {
      finishLogin(demo);
      setIsSubmitting(false);
      return;
    }

    setErrorMessage(
      "حسابات الموظفين تُدار من الإدارة. استخدم الحساب التجريبي الظاهر أسفل النموذج حالياً."
    );
    setIsSubmitting(false);
  };

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
          <h1 className="text-2xl font-extrabold text-blue-950">دخول الموظفين</h1>
          <p className="mt-2 text-sm text-slate-500">
            استقبال، مختبر، صيدلية، وأشعة — اختر دورك ثم سجّل الدخول.
          </p>
        </div>

        <div
          className={`mb-5 grid grid-cols-2 gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 p-1.5 ${AUTH_BODY_ANIM}`}
        >
          {STAFF_ROLES.map(({ value, label, icon: Icon }, index) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedRole(value)}
              style={{ animationDelay: `${0.2 + index * 0.08}s` }}
              className={`${AUTH_CLICKABLE.roleTabBase} gap-1.5 px-2 text-[11px] opacity-0 animate-[loginCategoryIn_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards] sm:text-sm ${
                selectedRole === value
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200/70"
                  : "text-slate-600 hover:bg-white hover:text-blue-700"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <form
          className={`space-y-4 ${AUTH_BODY_ANIM}`}
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
                placeholder="بريد الموظف"
                className={inputClass}
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
                placeholder="كلمة المرور"
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
            className={getSubmitButtonClass(isFormValid && !isSubmitting, "h-11 w-full")}
          >
            {isSubmitting ? "جاري الدخول..." : "دخول الموظف"}
          </button>
        </form>

        {demoAccount && (
          <>
            <button
              type="button"
              onClick={() => finishLogin(demoAccount)}
              className={`${AUTH_CLICKABLE.roleTabBase} mt-3 w-full border border-dashed border-teal-200 bg-teal-50/70 text-teal-800 hover:bg-teal-50`}
            >
              دخول تجريبي — {ROLE_LABELS[selectedRole]}
            </button>
            <p className="mt-2 text-center text-[11px] leading-5 text-slate-400" dir="ltr">
              {demoAccount.email} / {demoAccount.password}
            </p>
          </>
        )}

        <p className="mt-5 text-center text-sm text-slate-500" dir="rtl">
          مستخدم عادي؟{" "}
          <Link to="/login" className={AUTH_CLICKABLE.underlineLink}>
            دخول المريض / الطبيب
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-slate-400" dir="rtl">
          <Link to="/admin/login" className={`font-semibold ${AUTH_CLICKABLE.textLink}`}>
            دخول الإدارة
          </Link>
        </p>
      </AuthCard>
    </AuthLayout>
  );
}

export default StaffLoginPage;