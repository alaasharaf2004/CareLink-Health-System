import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  X,
  User,
  Mail,
  Lock,
  Phone,
  Stethoscope,
  MapPin,
  Hash,
} from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialty: "",
  national_id: "",
  address: "",
  gender: "male",
};

function AddNewDoctor() {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      showToast(
        "يرجى تعبئة الحقول الأساسية (الاسم، البريد، كلمة المرور)",
        "error",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // إرسال الطلب لـ API لارافيل
      const response = await apiClient.post("/admin/doctors", formData);

      if (response.status === 201 || response.status === 200) {
        showToast("تم إضافة الطبيب بنجاح", "success");
        setTimeout(() => {
          navigate("/admin/doctors");
        }, 1500);
      }
    } catch (error) {
      // طباعة الخطأ القادم من سيرفر لارافيل (مثال: الإيميل مسجل مسبقاً)
      const errorMsg =
        (error as any).response?.data?.message ||
        "حدث خطأ أثناء إضافة الطبيب. تأكد من البيانات.";
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <Toast toast={toast} onClose={hideToast} />

      <AdminPageHeader
        title="إضافة طبيب جديد"
        description="قم بإدخال بيانات الطبيب الجديد لإنشاء حساب له في النظام."
        action={undefined}
      />

      <div className="mx-auto max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="mb-6 text-xl font-extrabold text-blue-950 border-b border-slate-100 pb-4">
            البيانات الأساسية
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الاسم الكامل *
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="د. أحمد محمد"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                البريد الإلكتروني *
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  dir="ltr"
                  placeholder="doctor@example.com"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                كلمة المرور *
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  dir="ltr"
                  placeholder="••••••••"
                  className={inputClass}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  dir="ltr"
                  placeholder="0590000000"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                التخصص
              </label>
              <div className="relative">
                <Stethoscope
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="طب أطفال، جراحة، إلخ..."
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                رقم الهوية
              </label>
              <div className="relative">
                <Hash
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleChange}
                  dir="ltr"
                  placeholder="123456789"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                العنوان
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="المدينة، الشارع..."
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الجنس
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/doctors")}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
            >
              <X size={18} />
              إلغاء
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 ${
                isSubmitting
                  ? "cursor-not-allowed bg-blue-400"
                  : "cursor-pointer bg-blue-600 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-200/50"
              }`}
            >
              <Save size={18} />
              {isSubmitting ? "جاري الحفظ..." : "حفظ الطبيب"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewDoctor;
