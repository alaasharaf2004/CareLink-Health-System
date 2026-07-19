import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, Save, User, Phone, IdCard, ShieldCheck } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client";

const inputClass = "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function AdminProfilePage() {
  const { toast, showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    national_id: "",
    role: "",
  });
  
  const [passwords, setPasswords] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  });

  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    apiClient.get("/admin").then(res => {
      setForm(res.data);
    });
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put("/admin/profile", form);
      showToast("تم تحديث البيانات الشخصية", "success");
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      showToast("خطأ في تحديث البيانات", "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put("/admin/password", passwords);
      showToast("تم تحديث كلمة المرور", "success");
      setPasswords({ current_password: "", password: "", password_confirmation: "" });
    } catch (err) {
      setErrors(err.response?.data?.errors || {});
      showToast("خطأ في تحديث كلمة المرور", "error");
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <AdminPageHeader title="الملف الشخصي" description="إدارة معلومات الحساب والصلاحيات." />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* قسم البيانات الشخصية */}
        <form onSubmit={handleProfileSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-extrabold text-blue-950">البيانات الشخصية</h2>
          <div className="space-y-4">
            {[
              { label: "الاسم", key: "name", icon: User },
              { label: "البريد الإلكتروني", key: "email", icon: Mail },
              { label: "رقم الجوال", key: "phone", icon: Phone },
              { label: "رقم الهوية", key: "national_id", icon: IdCard },
              { label: "الصلاحية", key: "role", icon: ShieldCheck },
            ].map(({ label, key, icon: Icon }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
                <div className="relative">
                  <Icon size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type={key === 'email' ? 'email' : 'text'}
                    value={form[key] || ""} 
                    onChange={(e) => setForm({...form, [key]: e.target.value})} 
                    className={inputClass} 
                  />
                </div>
                {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key][0]}</p>}
              </div>
            ))}
          </div>
          <button type="submit" className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
            <Save size={16} /> حفظ البيانات
          </button>
        </form>

        {/* قسم كلمة المرور */}
        <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-extrabold text-blue-950">تغيير كلمة المرور</h2>
          <div className="space-y-4">
            {[
              { label: "كلمة المرور الحالية", key: "current_password", state: "current" },
              { label: "كلمة المرور الجديدة", key: "password", state: "new" },
              { label: "تأكيد الجديدة", key: "password_confirmation", state: "confirm" },
            ].map(({ label, key, state }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
                <div className="relative">
                  <Lock size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type={showPass[state] ? "text" : "password"} 
                    value={passwords[key]} 
                    onChange={(e) => setPasswords({...passwords, [key]: e.target.value})} 
                    className={`${inputClass} pl-10`} 
                  />
                  <button type="button" onClick={() => setShowPass({...showPass, [state]: !showPass[state]})} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass[state] ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key][0]}</p>}
              </div>
            ))}
          </div>
          <button type="submit" className="mt-6 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100">
            <Lock size={16} /> تحديث كلمة المرور
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminProfilePage;