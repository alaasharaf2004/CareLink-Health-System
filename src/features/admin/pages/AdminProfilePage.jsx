import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Save, User } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { MOCK_ADMIN_PROFILE } from "../data/adminMockData";
import { isValidEmail } from "../../authentication/utils/validation";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function AdminProfilePage() {
  const { toast, showToast, hideToast } = useToast();
  const [name, setName] = useState(MOCK_ADMIN_PROFILE.name);
  const [email, setEmail] = useState(MOCK_ADMIN_PROFILE.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validateProfile = () => {
    const next = {};
    if (!name.trim()) next.name = "الاسم مطلوب";
    if (!isValidEmail(email)) next.email = "أدخل بريداً إلكترونياً صحيحاً";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validatePassword = () => {
    const next = {};
    if (!currentPassword) next.currentPassword = "كلمة المرور الحالية مطلوبة";
    if (newPassword.length < 6)
      next.newPassword = "كلمة المرور الجديدة 6 أحرف على الأقل";
    if (newPassword !== confirmPassword)
      next.confirmPassword = "كلمتا المرور غير متطابقتين";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    if (!validateProfile()) return;
    showToast("تم حفظ بياناتك الشخصية بنجاح", "success");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (!validatePassword()) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("تم تحديث كلمة المرور بنجاح", "success");
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />

      <AdminPageHeader
        title="الملف الشخصي"
        description="عدّل بياناتك الشخصية وبيانات تسجيل الدخول."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form
          onSubmit={handleProfileSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-extrabold text-blue-950">
            البيانات الشخصية
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الاسم
              </label>
              <div className="relative">
                <User
                  size={17}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={inputClass}
                  placeholder="اسم المسؤول"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
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
                  className={inputClass}
                  placeholder="admin@gmail.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <Save size={16} />
            حفظ البيانات
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-extrabold text-blue-950">
            تغيير كلمة المرور
          </h2>

          <div className="space-y-4">
            {[
              {
                label: "كلمة المرور الحالية",
                value: currentPassword,
                setValue: setCurrentPassword,
                show: showCurrent,
                setShow: setShowCurrent,
                errorKey: "currentPassword",
              },
              {
                label: "كلمة المرور الجديدة",
                value: newPassword,
                setValue: setNewPassword,
                show: showNew,
                setShow: setShowNew,
                errorKey: "newPassword",
              },
              {
                label: "تأكيد كلمة المرور",
                value: confirmPassword,
                setValue: setConfirmPassword,
                show: showConfirm,
                setShow: setShowConfirm,
                errorKey: "confirmPassword",
              },
            ].map(({ label, value, setValue, show, setShow, errorKey }) => (
              <div key={errorKey}>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {label}
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    className={`${inputClass} pl-10`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label={show ? "إخفاء" : "إظهار"}
                  >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors[errorKey] && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors[errorKey]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
          >
            <Lock size={16} />
            تحديث كلمة المرور
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminProfilePage;
