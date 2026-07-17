import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Download, Mail, Phone, Save } from "lucide-react";

import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import FadeUp from "../../patient/components/FadeUp";
import ProfileAvatar from "../../patient/components/ProfileAvatar";
import { formatArabicDateTime } from "../../patient/utils/formatDateTime";
import DoctorPageHeader from "../components/DoctorPageHeader";
import { getPatientById } from "../data/doctorMockData";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const BOOL_FIELDS = [
  { key: "is_diabetic", label: "مصاب بالسكري" },
  { key: "is_hypertensive", label: "مصاب بارتفاع الضغط" },
  { key: "is_smoker", label: "مدخّن" },
];

const EDITABLE_TEXT = [
  { key: "blood_type", label: "فصيلة الدم" },
  { key: "weight_kg", label: "الوزن (كغ)" },
  { key: "height_cm", label: "الطول (سم)" },
  { key: "allergies", label: "الحساسية" },
  { key: "chronic_diseases", label: "الأمراض المزمنة" },
  { key: "current_medications", label: "الأدوية الحالية" },
  { key: "emergency_contact_name", label: "اسم جهة الطوارئ" },
  { key: "emergency_contact_phone", label: "هاتف جهة الطوارئ", dir: "ltr" },
];

function DoctorPatientDetailPage() {
  const { id } = useParams();
  const patient = getPatientById(id);
  const { toast, showToast, hideToast } = useToast();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const found = getPatientById(id);
    if (found) {
      setForm({ ...found.medical });
    } else {
      setForm(null);
    }
  }, [id]);

  if (!patient || !form) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="font-bold text-slate-600">المريض غير موجود</p>
        <Link
          to="/doctor/patients"
          className="mt-4 inline-block text-sm font-bold text-blue-600"
        >
          العودة للمرضى
        </Link>
      </div>
    );
  }

  const updateField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleExport = () => {
    const headers = Object.keys(form);
    const values = headers.map((key) => {
      const value = form[key];
      if (typeof value === "boolean") return value ? "نعم" : "لا";
      return `"${String(value ?? "").replace(/"/g, '""')}"`;
    });
    const csv = `\uFEFF${headers.join(",")}\n${values.join(",")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `medical-profile-${patient.id}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("تم تصدير الملف الطبي", "success");
  };

  const handleSave = (event) => {
    event.preventDefault();
    showToast("تم حفظ الملف الطبي", "success");
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />

      <FadeUp index={0}>
        <Link
          to="/doctor/patients"
          className="inline-flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 text-sm font-bold text-blue-600 transition-all duration-200 hover:-translate-x-1 hover:border-blue-100 hover:bg-blue-50"
        >
          <ArrowRight size={16} />
          العودة للمرضى
        </Link>
      </FadeUp>

      <DoctorPageHeader
        title="الملف الطبي للمريض"
        description="عرض وتعديل البيانات الطبية وتصديرها إلى Excel."
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
        <div className="patient-card overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
          <div className="flex flex-col gap-5 border-b border-slate-100 bg-gradient-to-l from-blue-50/50 via-white to-white p-6 sm:flex-row sm:items-center">
            <ProfileAvatar
              src={patient.profile_picture}
              name={patient.name}
              size="xl"
              ring
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold text-blue-950">
                  {patient.name}
                </h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                  نشط
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {patient.id} · {patient.age} سنة ·{" "}
                {patient.gender === "male" ? "ذكر" : "أنثى"}
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5" dir="ltr">
                  <Phone size={14} className="text-slate-400" />
                  {patient.phone}
                </span>
                <span className="inline-flex items-center gap-1.5" dir="ltr">
                  <Mail size={14} className="text-slate-400" />
                  {patient.email}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
              <p className="text-xs font-bold text-slate-400">آخر زيارة</p>
              <p className="mt-1 font-bold text-blue-950">
                {formatArabicDateTime(patient.last_visit)}
              </p>
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp index={2}>
        <form
          onSubmit={handleSave}
          className="patient-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
        >
          <h3 className="mb-5 text-lg font-extrabold text-blue-950">
            البيانات الطبية
          </h3>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              رقم المريض
            </label>
            <input
              className={`${inputClass} bg-slate-50`}
              value={form.patient_id}
              readOnly
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {EDITABLE_TEXT.slice(0, 3).map(({ key, label, dir }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {label}
                </label>
                <input
                  className={inputClass}
                  value={form[key]}
                  dir={dir}
                  onChange={(e) => updateField(key, e.target.value)}
                />
              </div>
            ))}
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
            {EDITABLE_TEXT.slice(3).map(({ key, label, dir }) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {label}
                </label>
                <input
                  className={inputClass}
                  value={form[key]}
                  dir={dir}
                  onChange={(e) => updateField(key, e.target.value)}
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

export default DoctorPatientDetailPage;
