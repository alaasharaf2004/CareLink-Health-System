import { useState } from "react";
import { Flag, ShieldCheck } from "lucide-react";

import Modal from "../../admin/components/Modal";
import { careSystemStore } from "../../care-system/data/careSystemStore";
import {
  INSURANCE_STATUS_OPTIONS,
  RECEPTION_FLAG_OPTIONS,
} from "../utils/receptionHelpers";

function ReceptionPatientMetaModal({ patient, patients = [], onClose, onSaved, onError }) {
  const [form, setForm] = useState({
    guardianId: patient.guardianId || "",
    insuranceStatus: patient.insuranceStatus || "unknown",
    insuranceProvider: patient.insuranceProvider || "",
    receptionFlags: patient.receptionFlags || [],
    receptionNote: patient.receptionNote || "",
  });

  const guardians = patients.filter((p) => p.id !== patient.id && !p.guardianId);

  const toggleFlag = (value) => {
    setForm((prev) => ({
      ...prev,
      receptionFlags: prev.receptionFlags.includes(value)
        ? prev.receptionFlags.filter((item) => item !== value)
        : [...prev.receptionFlags, value],
    }));
  };

  const save = (event) => {
    event.preventDefault();
    try {
      careSystemStore.updatePatientReceptionMeta(patient.id, {
        ...form,
        guardianId: form.guardianId || null,
      });
      onSaved?.();
    } catch (error) {
      onError?.(error.message || "تعذر حفظ بيانات المريض");
    }
  };

  return (
    <Modal title={`تنبيهات وتأمين — ${patient.name}`} onClose={onClose} maxWidth="max-w-lg">
      <form className="space-y-4" onSubmit={save} dir="rtl">
        <label className="block space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <ShieldCheck size={14} /> حالة التأمين
          </span>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
            value={form.insuranceStatus}
            onChange={(e) => setForm({ ...form, insuranceStatus: e.target.value })}
          >
            {INSURANCE_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <input
          className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
          placeholder="شركة التأمين"
          value={form.insuranceProvider}
          onChange={(e) => setForm({ ...form, insuranceProvider: e.target.value })}
        />

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-slate-600">ولي الأمر / الحساب الأساسي</span>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
            value={form.guardianId}
            onChange={(e) => setForm({ ...form, guardianId: e.target.value })}
          >
            <option value="">بدون تابع</option>
            {guardians.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Flag size={14} /> أعلام التنبيه
          </p>
          <div className="flex flex-wrap gap-2">
            {RECEPTION_FLAG_OPTIONS.map((flag) => {
              const active = form.receptionFlags.includes(flag.value);
              return (
                <button
                  key={flag.value}
                  type="button"
                  onClick={() => toggleFlag(flag.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition ${
                    active
                      ? flag.className
                      : "bg-white text-slate-500 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {flag.label}
                </button>
              );
            })}
          </div>
        </div>

        <textarea
          className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          placeholder="ملاحظة تظهر للاستقبال بجانب اسم المريض"
          value={form.receptionNote}
          onChange={(e) => setForm({ ...form, receptionNote: e.target.value })}
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          حفظ
        </button>
      </form>
    </Modal>
  );
}

export default ReceptionPatientMetaModal;
