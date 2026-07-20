import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";

import CareLinkLogo from "../../../components/CareLinkLogo";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import {
  AUTH_BODY_ANIM,
  AUTH_FORM_ALIGN,
  AUTH_FORM_CARD_CLASS,
  AUTH_HERO_ALIGN,
  AUTH_HERO_NUDGE,
  AUTH_LOGO_ANIM,
  AUTH_STEP_ANIM,
} from "../constants/authForm";
import { getDashboardPath } from "../constants/authRoutes";
import { careSystemStore } from "../../care-system/data/careSystemStore";

function ForceChangePasswordPage() {
  const navigate = useNavigate();
  const { profile, role, setSession, clearSession, token } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (!profile?.staffId) {
      setError("لا يمكن تحديث كلمة المرور لهذا الحساب");
      return;
    }

    setIsSubmitting(true);
    try {
      careSystemStore.changeStaffPassword(profile.staffId, password);
      setSession({
        token,
        role,
        profile: {
          ...profile,
          mustChangePassword: false,
        },
      });
      navigate(getDashboardPath(role), { replace: true });
    } catch (err) {
      setError(err.message || "تعذر تغيير كلمة المرور");
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
        <div className={`mb-6 flex justify-center ${AUTH_LOGO_ANIM}`}>
          <CareLinkLogo size={44} showText layout="form" align="center" />
        </div>

        <div className={`mb-6 text-center ${AUTH_STEP_ANIM}`} dir="rtl">
          <h1 className="text-2xl font-extrabold text-[#101860]">تغيير كلمة المرور</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            حسابك يستخدم كلمة مرور مؤقتة من الإدارة. يجب تعيين كلمة مرور جديدة قبل
            استخدام النظام.
          </p>
        </div>

        <form className={`space-y-4 ${AUTH_BODY_ANIM}`} onSubmit={handleSubmit} dir="rtl">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-600">كلمة المرور الجديدة</span>
            <div className="relative">
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="h-11 w-full rounded-xl border border-slate-200 pr-10 pl-10 text-sm outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-600">تأكيد كلمة المرور</span>
            <input
              type={showPassword ? "text" : "password"}
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ ومتابعة"}
          </button>

          <button
            type="button"
            onClick={() => {
              clearSession();
              navigate("/login", { replace: true });
            }}
            className="w-full text-sm font-bold text-slate-500 hover:text-slate-700"
          >
            تسجيل الخروج
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

export default ForceChangePasswordPage;
