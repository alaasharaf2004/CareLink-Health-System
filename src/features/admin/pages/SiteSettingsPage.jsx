import { useEffect, useState } from "react";

import AdminPageHeader from "../components/AdminPageHeader";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";

function SiteSettingsPage() {
  const [form, setForm] = useState(careSystemStore.getSiteSettings());
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const reload = () => setForm(careSystemStore.getSiteSettings());
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    careSystemStore.saveSiteSettings(form);
    showToast("تم حفظ إعدادات الموقع", "success");
  };

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
      <AdminPageHeader
        title="إعدادات الموقع"
        description="التحكم بمعلومات التواصل وأقسام اللاندينغ العامة."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
        dir="rtl"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {field("platformName", "اسم المنصة")}
          {field("supportPhone", "هاتف الدعم")}
          {field("supportEmail", "إيميل الدعم", "email")}
          {field("address", "العنوان")}
          {field("socialWeb", "رابط الموقع")}
          {field("socialWhatsapp", "رابط واتساب")}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["showBlog", "إظهار المدونة"],
            ["showOffers", "إظهار العروض"],
            ["showDoctors", "إظهار الأطباء"],
            ["showFaq", "إظهار الأسئلة الشائعة"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
              />
              {label}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          حفظ الإعدادات
        </button>
      </form>
    </div>
  );
}

export default SiteSettingsPage;
