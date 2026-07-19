import { useEffect, useState } from "react";
import { Download, Save } from "lucide-react";

import apiClient from "../../../lib/api/client";

import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { useAuth } from "../../authentication/context/AuthContext";
import { careSystemStore } from "../../care-system/data/careSystemStore";
import FadeUp from "../components/FadeUp";
import PatientPageHeader from "../components/PatientPageHeader";
import { downloadMedicalProfilePdf } from "../utils/downloadMedicalProfilePdf";

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

const REQUIRED_FIELDS = [
  { key: "blood_type", label: "فصيلة الدم" },
  { key: "weight_kg", label: "الوزن" },
  { key: "height_cm", label: "الطول" },
  { key: "allergies", label: "الحساسية" },
  { key: "chronic_diseases", label: "الأمراض المزمنة" },
  { key: "current_medications", label: "الأدوية الحالية" },
  { key: "emergency_contact_name", label: "اسم جهة الطوارئ" },
  { key: "emergency_contact_phone", label: "هاتف جهة الطوارئ" },
];

const BOOL_FIELDS = [
  { key: "is_diabetic", label: "مصاب بالسكري" },
  { key: "is_hypertensive", label: "مصاب بارتفاع الضغط" },
  { key: "is_smoker", label: "مدخّن" },
];

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const inputErrorClass =
  "h-11 w-full rounded-xl border border-red-400 bg-red-50 px-4 text-sm text-slate-700 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100";

function PatientMedicalProfilePage() {
  const { profile: authProfile } = useAuth();
  const [form, setForm] = useState({ ...EMPTY_MEDICAL_PROFILE });
  const [errors, setErrors] = useState({});
  const [patientName, setPatientName] = useState("المريض");
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
      const loadMedicalProfile = async () => {
        console.log("loadMedicalProfile started");
        try {
          console.log("before profile request");
          // بيانات المستخدم
          const profileResponse = await apiClient.get("/patient/profile");
          setPatientName(profileResponse.data.user.name);

          console.log("before medical request");

          // بيانات الملف الطبي
          const medicalResponse = await apiClient.get("/patient/medical-profile");
          console.log("medical response:", medicalResponse.data);

          const profile = medicalResponse.data.data;
          console.log(JSON.stringify(profile, null, 2));


          setForm({
            ...EMPTY_MEDICAL_PROFILE,
            ...Object.fromEntries(
              Object.entries(profile).map(([key, value]) => [
                key,
                value ?? EMPTY_MEDICAL_PROFILE[key] ?? "",
              ])
            ),
          });
        } catch (error) {
          console.error(error);
        }
      };

      loadMedicalProfile();
    }, []);



  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};
    for (const field of REQUIRED_FIELDS) {
      if (!String(form[field.key] ?? "").trim()) {
        nextErrors[field.key] = `يرجى تعبئة ${field.label}`;
      }
    }

    const weight = Number(form.weight_kg);
    if (form.weight_kg && (Number.isNaN(weight) || weight <= 0)) {
      nextErrors.weight_kg = "أدخل وزناً صحيحاً";
    }

    const height = Number(form.height_cm);
    if (form.height_cm && (Number.isNaN(height) || height <= 0)) {
      nextErrors.height_cm = "أدخل طولاً صحيحاً";
    }

    if (
      form.emergency_contact_phone &&
      String(form.emergency_contact_phone).trim().length < 8
    ) {
      nextErrors.emergency_contact_phone = "أدخل رقم هاتف صالحاً";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const persistAndDownload = async () => {
    const payload = {
      ...form,
      patient_id: form.patient_id,
      weight_kg: String(form.weight_kg).trim(),
      height_cm: String(form.height_cm).trim(),
      blood_type: String(form.blood_type).trim(),
      allergies: String(form.allergies).trim(),
      chronic_diseases: String(form.chronic_diseases).trim(),
      current_medications: String(form.current_medications).trim(),
      emergency_contact_name: String(form.emergency_contact_name).trim(),
      emergency_contact_phone: String(form.emergency_contact_phone).trim(),
    };
    await apiClient.patch("/patient/profile", payload);
    setForm(payload);

    const downloaded = downloadMedicalProfilePdf({
      patientName,
      profile: payload,
    });

    if (!downloaded) {
      showToast("تم الحفظ، لكن تعذر إنشاء ملف PDF", "error");
      return;
    }

    showToast("تم حفظ الملف الطبي وتحميل PDF", "success");
  };

  const handleExport = async () => {
    if (!validate()) {
      showToast("أكمل جميع الحقول المطلوبة قبل التصدير", "error");
      return;
    }
    await persistAndDownload();
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!validate()) {
      showToast("لا يمكن الحفظ: يوجد حقول فارغة أو غير صحيحة", "error");
      return;
    }
    await persistAndDownload();
  };

  const fieldClass = (key) => (errors[key] ? inputErrorClass : inputClass);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />

      <PatientPageHeader
        title="الملف الطبي"
        description="أكمل بياناتك الطبية ثم احفظها — سيتم تحميل ملف PDF تلقائياً."
        action={
          <button
            type="button"
            onClick={handleExport}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Download size={18} />
            تحميل PDF
          </button>
        }
      />

      <FadeUp index={1}>
        <form
          onSubmit={handleSave}
          className="patient-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                رقم المريض
              </label>
              <input
                className={inputClass}
                value={form.patient_id}
                readOnly
                aria-readonly="true"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                فصيلة الدم <span className="text-red-500">*</span>
              </label>
              <input
                className={fieldClass("blood_type")}
                value={form.blood_type}
                onChange={(e) => updateField("blood_type", e.target.value)}
                placeholder="مثال: O+"
              />
              {errors.blood_type && (
                <p className="mt-1 text-xs font-bold text-red-600">{errors.blood_type}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الوزن (كغ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                className={fieldClass("weight_kg")}
                value={form.weight_kg}
                onChange={(e) => updateField("weight_kg", e.target.value)}
                placeholder="مثال: 75"
              />
              {errors.weight_kg && (
                <p className="mt-1 text-xs font-bold text-red-600">{errors.weight_kg}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                الطول (سم) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                className={fieldClass("height_cm")}
                value={form.height_cm}
                onChange={(e) => updateField("height_cm", e.target.value)}
                placeholder="مثال: 175"
              />
              {errors.height_cm && (
                <p className="mt-1 text-xs font-bold text-red-600">{errors.height_cm}</p>
              )}
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
              { key: "allergies", label: "الحساسية", placeholder: "مثال: لا يوجد / بنسلين" },
              {
                key: "chronic_diseases",
                label: "الأمراض المزمنة",
                placeholder: "مثال: لا يوجد / ربو",
              },
              {
                key: "current_medications",
                label: "الأدوية الحالية",
                placeholder: "مثال: لا يوجد / أسبرين",
              },
              {
                key: "emergency_contact_name",
                label: "اسم جهة الطوارئ",
                placeholder: "اسم الشخص للتواصل",
              },
              {
                key: "emergency_contact_phone",
                label: "هاتف جهة الطوارئ",
                placeholder: "05xxxxxxxx",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  className={fieldClass(key)}
                  value={form[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  dir={key.includes("phone") ? "ltr" : "rtl"}
                  placeholder={placeholder}
                />
                {errors[key] && (
                  <p className="mt-1 text-xs font-bold text-red-600">{errors[key]}</p>
                )}
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
