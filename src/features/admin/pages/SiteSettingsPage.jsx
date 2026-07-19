import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client";

function SiteSettingsPage() {
  const [form, setForm] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    apiClient.get("/admin/settings").then(res => {
      setForm(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiClient.post("/admin/settings", form);
      showToast("تم حفظ إعدادات الموقع", "success");
    } catch {
      showToast("خطأ في الحفظ", "error");
    }
  };

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;

  const field = (key, label, type = "text") => (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        type={type}
        className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium"
        value={form[key] || ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </label>
  );

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader title="إعدادات الموقع" description="التحكم بمعلومات التواصل." />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6" dir="rtl">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("platformName", "اسم المنصة")}
          {field("supportPhone", "هاتف الدعم")}
          {field("supportEmail", "إيميل الدعم", "email")}
          {field("address", "العنوان")}
          {field("socialWeb", "رابط الموقع")}
          {field("socialWhatsapp", "رابط واتساب")}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {["showBlog", "showOffers", "showDoctors", "showFaq"].map((key) => (
            <label key={key} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={form[key] === "true" || form[key] === true}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
              />
              {key}
            </label>
          ))}
        </div>

        <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">حفظ الإعدادات</button>
      </form>
    </div>
  );
}

export default SiteSettingsPage;