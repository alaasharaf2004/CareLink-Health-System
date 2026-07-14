import { useState } from "react";
import { Eye, EyeOff, Lock, Save } from "lucide-react";

import PatientPageHeader from "../components/PatientPageHeader";
import FadeUp from "../components/FadeUp";
import ProfileAvatar from "../components/ProfileAvatar";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { MOCK_PATIENT_PROFILE } from "../data/patientMockData";
import { isValidEmail } from "../../authentication/utils/validation";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function PatientSettingsPage() {
  const { toast, showToast, hideToast } = useToast();
  const [profile, setProfile] = useState({ ...MOCK_PATIENT_PROFILE });
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });

  const handleProfileSave = (event) => {
    event.preventDefault();
    if (!isValidEmail(profile.email)) {
      showToast("أدخل بريداً إلكترونياً صحيحاً", "error");
      return;
    }
    showToast("تم حفظ الإعدادات", "success");
  };

  const handlePasswordSave = (event) => {
    event.preventDefault();
    if (passwords.newPassword.length < 6) {
      showToast("كلمة المرور 6 أحرف على الأقل", "error");
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      showToast("كلمتا المرور غير متطابقتين", "error");
      return;
    }
    setPasswords({ current: "", newPassword: "", confirm: "" });
    showToast("تم تحديث كلمة المرور", "success");
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />

      <PatientPageHeader
        title="الإعدادات"
        description="تعديل بياناتك الشخصية وكلمة المرور."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <FadeUp index={1}>
        <form
          onSubmit={handleProfileSave}
          className="patient-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-5">
            <ProfileAvatar
              src={profile.profile_picture}
              name={profile.name}
              size="xl"
              ring
            />
            <div>
              <p className="font-extrabold text-blue-950">{profile.name}</p>
              <p className="text-sm text-slate-500">{profile.email}</p>
              <button
                type="button"
                onClick={() =>
                  showToast("تغيير الصورة متاح لاحقاً مع الـ API", "info")
                }
                className="mt-2 cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                تغيير الصورة الشخصية
              </button>
            </div>
          </div>

          <h2 className="mb-5 text-lg font-extrabold text-blue-950">
            البيانات الأساسية
          </h2>
          <div className="space-y-4">
            {[
              { key: "name", label: "الاسم" },
              { key: "email", label: "البريد الإلكتروني", dir: "ltr" },
              { key: "phone", label: "الهاتف", dir: "ltr" },
              { key: "date_of_birth", label: "تاريخ الميلاد", type: "date" },
              { key: "national_id", label: "رقم الهوية", dir: "ltr" },
              { key: "address", label: "العنوان" },
            ].map(({ key, label, dir, type = "text" }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {label}
                </label>
                <input
                  type={type}
                  className={inputClass}
                  dir={dir}
                  value={profile[key]}
                  onChange={(e) =>
                    setProfile((c) => ({ ...c, [key]: e.target.value }))
                  }
                />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الجنس
              </label>
              <select
                className={inputClass}
                value={profile.gender}
                onChange={(e) =>
                  setProfile((c) => ({ ...c, gender: e.target.value }))
                }
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الحالة
              </label>
              <input
                className={`${inputClass} bg-slate-50`}
                value={profile.status === "active" ? "مفعّل" : profile.status}
                readOnly
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <Save size={16} />
            حفظ البيانات
          </button>
        </form>
        </FadeUp>

        <FadeUp index={2}>
        <form
          onSubmit={handlePasswordSave}
          className="patient-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-extrabold text-blue-950">
            تغيير كلمة المرور
          </h2>

          {[
            { key: "current", label: "كلمة المرور الحالية" },
            { key: "newPassword", label: "كلمة المرور الجديدة" },
            { key: "confirm", label: "تأكيد كلمة المرور" },
          ].map(({ key, label }) => (
            <div key={key} className="mb-4">
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {label}
              </label>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword[key] ? "text" : "password"}
                  className={`${inputClass} pl-10`}
                  value={passwords[key]}
                  onChange={(e) =>
                    setPasswords((c) => ({ ...c, [key]: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((c) => ({ ...c, [key]: !c[key] }))
                  }
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100"
                >
                  {showPassword[key] ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-100"
          >
            <Lock size={16} />
            تحديث كلمة المرور
          </button>
        </form>
        </FadeUp>
      </div>
    </div>
  );
}

export default PatientSettingsPage;
