import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Save } from "lucide-react";

import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import FadeUp from "../../patient/components/FadeUp";
import ProfileAvatar from "../../patient/components/ProfileAvatar";
import DoctorPageHeader from "../components/DoctorPageHeader";
import { apiClient } from "../../../lib/api/client";

const EMPTY_DOCTOR_PROFILE = {
  name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  national_id: "",
  address: "",
  gender: "male",
  status: "active",
  specialty: "",
  profile_picture: "",
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function DoctorSettingsPage() {
  const { toast, showToast, hideToast } = useToast();
  const [profile, setProfile] = useState({ ...EMPTY_DOCTOR_PROFILE });
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/doctor/profile");
      const result = response.data;

      if (result.data) {
        setProfile({
          name: result.data.name || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          date_of_birth: result.data.date_of_birth || "",
          national_id: result.data.national_id || "",
          address: result.data.address || "",
          gender: result.data.gender || "male",
          status: result.data.status || "active",
          specialty: result.data.specialty || "",
          profile_picture: result.data.profile_picture || "",
        });
      }
    } catch {
      showToast("خطأ في جلب بيانات الملف الشخصي", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return <div className="text-center py-20 font-bold text-slate-500">جاري تحميل بياناتك...</div>;
  }

  const handleProfileSave = async (event) => {
    event.preventDefault();
    try {
      const response = await apiClient.put("/doctor/profile", profile);
      if (response.status === 200 || response.data) {
        showToast("تم حفظ البيانات بنجاح", "success");
        fetchProfile();
      } else {
        showToast("حدث خطأ أثناء الحفظ", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "خطأ في الاتصال بالخادم", "error");
    }
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      showToast("كلمتا المرور غير متطابقتين", "error");
      return;
    }

    try {
      await apiClient.post("/doctor/profile/change-password", {
        current_password: passwords.current,
        new_password: passwords.newPassword,
      });

      showToast("تم تحديث كلمة المرور بنجاح", "success");
      setPasswords({ current: "", newPassword: "", confirm: "" });
    } catch (error) {
      showToast(error.response?.data?.message || "فشل تحديث كلمة المرور", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />

      <DoctorPageHeader
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
                <p className="mt-1 text-xs font-bold text-blue-600">
                  {profile.specialty}
                </p>
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
                    value={profile[key] || ""}
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
                    className={`${inputClass} pl-10 pr-10`}
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

export default DoctorSettingsPage;