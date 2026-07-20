import { useMemo, useState } from "react";

import Modal from "../../admin/components/Modal";
import { careSystemStore } from "../../care-system/data/careSystemStore";
import {
  emptyPatientForm,
  INSURANCE_STATUS_OPTIONS,
  RECEPTION_FLAG_OPTIONS,
} from "../utils/receptionHelpers";

function ReceptionRegisterPatientModal({
  onClose,
  onSuccess,
  onError,
  patients = [],
  initialForm,
}) {
  const [form, setForm] = useState(() => emptyPatientForm(initialForm || {}));

  const guardianOptions = useMemo(
    () => patients.filter((p) => !p.guardianId),
    [patients]
  );

  const toggleFlag = (value) => {
    setForm((prev) => {
      const flags = prev.receptionFlags || [];
      return {
        ...prev,
        receptionFlags: flags.includes(value)
          ? flags.filter((item) => item !== value)
          : [...flags, value],
      };
    });
  };

  const savePatient = (event) => {
    event.preventDefault();
    try {
      const created = careSystemStore.savePatient({
        ...form,
        guardianId: form.guardianId || null,
        createWebAccount: form.createWebAccount,
      });
      onSuccess?.(created, form);
    } catch (error) {
      onError?.(error.message || "تعذر تسجيل المريض");
    }
  };

  return (
    <Modal title="تسجيل مريض جديد" onClose={onClose} maxWidth="max-w-2xl">
      <form className="space-y-3" onSubmit={savePatient} dir="rtl">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
            placeholder="الاسم الكامل"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
            placeholder="الجوال"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
            placeholder="رقم الهوية (اختياري)"
            value={form.nationalId}
            onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
          />
          <select
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option>ذكر</option>
            <option>أنثى</option>
          </select>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="mb-2 text-xs font-extrabold text-slate-600">تابع لعائلة (اختياري)</p>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
            value={form.guardianId || ""}
            onChange={(e) => setForm({ ...form, guardianId: e.target.value })}
          >
            <option value="">بدون ولي أمر — حساب مستقل</option>
            {guardianOptions.map((p) => (
              <option key={p.id} value={p.id}>
                تابع لـ {p.name}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px] font-semibold text-slate-400">
            مفيد لعيادات الأطفال: ربط الطفل بحساب الأم/الأب
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-600">حالة التأمين</span>
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
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-slate-600">شركة التأمين</span>
            <input
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
              placeholder="اختياري"
              value={form.insuranceProvider}
              onChange={(e) => setForm({ ...form, insuranceProvider: e.target.value })}
            />
          </label>
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <p className="mb-2 text-xs font-extrabold text-slate-600">تنبيهات الاستقبال</p>
          <div className="flex flex-wrap gap-2">
            {RECEPTION_FLAG_OPTIONS.map((flag) => {
              const active = (form.receptionFlags || []).includes(flag.value);
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
          <textarea
            className="mt-3 min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            placeholder="ملاحظة للاستقبال (اختياري)"
            value={form.receptionNote}
            onChange={(e) => setForm({ ...form, receptionNote: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700">
          <input
            type="checkbox"
            checked={form.createWebAccount}
            onChange={(e) => setForm({ ...form, createWebAccount: e.target.checked })}
          />
          إنشاء حساب ويب للمريض (بريد + كلمة مرور)
        </label>

        {form.createWebAccount && (
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="email"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
              placeholder="البريد الإلكتروني"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
              placeholder="كلمة المرور"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
        >
          حفظ المريض ومتابعة الحجز
        </button>
      </form>
    </Modal>
  );
}

export default ReceptionRegisterPatientModal;
