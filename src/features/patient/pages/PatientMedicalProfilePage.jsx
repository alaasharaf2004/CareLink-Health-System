import { useState } from "react";
import { Download, Save } from "lucide-react";

import PatientPageHeader from "../components/PatientPageHeader";
import FadeUp from "../components/FadeUp";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";

const EMPTY_MEDICAL_PROFILE = {
  patient_id: "",
  blood_type: "",
  weight_kg: "",
  height_cm: "",
  is_diabetic: false,
  is_hypertensive: false,
  is_smoker: false,
  allergies: "",
  chronic_diseases: "",
  current_medications: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const BOOL_FIELDS = [
  { key: "is_diabetic", label: "مصاب بالسكري" },
  { key: "is_hypertensive", label: "مصاب بارتفاع الضغط" },
  { key: "is_smoker", label: "مدخّن" },
];

function PatientMedicalProfilePage() {
  const [form, setForm] = useState({ ...EMPTY_MEDICAL_PROFILE });
  const { toast, showToast, hideToast } = useToast();

  const updateField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleExport = () => {
    showToast("تم تجهيز تصدير Excel (تصميم)", "info");
  };

  const handleSave = (event) => {
    event.preventDefault();
    showToast("تم حفظ الملف الطبي", "success");
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />

      <PatientPageHeader
        title="الملف الطبي"
        description="عرض وتعديل بياناتك الطبية وتصديرها."
        action={
          <button
            type="button"
            onClick={handleExport}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Download size={18} />
            تصدير Excel
          </button>
        }
      />

      <FadeUp index={1}>
      <form
        onSubmit={handleSave}
        className="patient-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              رقم المريض
            </label>
            <input
              className={inputClass}
              value={form.patient_id}
              onChange={(e) => updateField("patient_id", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              فصيلة الدم
            </label>
            <input
              className={inputClass}
              value={form.blood_type}
              onChange={(e) => updateField("blood_type", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              الوزن (كغ)
            </label>
            <input
              className={inputClass}
              value={form.weight_kg}
              onChange={(e) => updateField("weight_kg", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              الطول (سم)
            </label>
            <input
              className={inputClass}
              value={form.height_cm}
              onChange={(e) => updateField("height_cm", e.target.value)}
            />
          </div>
        </div>

        <div className="my-5 flex flex-wrap gap-4">
          {BOOL_FIELDS.map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
            >
              <input
                type="checkbox"
                checked={Boolean(form[key])}
                onChange={(e) => updateField(key, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              {label}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { key: "allergies", label: "الحساسية" },
            { key: "chronic_diseases", label: "الأمراض المزمنة" },
            { key: "current_medications", label: "الأدوية الحالية" },
            { key: "emergency_contact_name", label: "اسم جهة الطوارئ" },
            { key: "emergency_contact_phone", label: "هاتف جهة الطوارئ" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {label}
              </label>
              <input
                className={inputClass}
                value={form[key]}
                onChange={(e) => updateField(key, e.target.value)}
                dir={key.includes("phone") ? "ltr" : "rtl"}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
        >
          <Save size={16} />
          حفظ التعديلات
        </button>
      </form>
      </FadeUp>
    </div>
  );
}

export default PatientMedicalProfilePage;
