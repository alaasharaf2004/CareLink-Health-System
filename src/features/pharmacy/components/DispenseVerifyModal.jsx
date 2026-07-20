import { useMemo, useState } from "react";
import { AlertTriangle, PackageCheck, Printer, ShieldCheck } from "lucide-react";

import Modal from "../../admin/components/Modal";
import { careSystemStore } from "../../care-system/data/careSystemStore";
import { useAuth } from "../../authentication/context/AuthContext";
import { printDispenseReceipt } from "../utils/printDispenseReceipt";

function DispenseVerifyModal({ prescription, onClose, onSuccess }) {
  const { profile } = useAuth();
  const [idLast4, setIdLast4] = useState("");
  const [notes, setNotes] = useState("");
  const [acknowledgeAllergy, setAcknowledgeAllergy] = useState(false);
  const [printAfter, setPrintAfter] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patient = careSystemStore.getPatient(prescription.patientId);
  const nationalId = prescription.nationalId || patient?.nationalId || "";
  const phone = prescription.phone || prescription.patientPhone || patient?.phone || "";
  const profileMed = careSystemStore.getMedicalProfile(prescription.patientId);
  const allergies = String(profileMed?.allergies || "").trim() || "غير مسجّلة";
  const patientName = prescription.patient || prescription.patientName || patient?.name || "مريض";

  const verifyLabel = nationalId.replace(/\D/g, "").length >= 4 ? "الهوية" : "الجوال";

  const allergyConflict = useMemo(
    () =>
      careSystemStore.findAllergyConflict(
        profileMed?.allergies,
        prescription.medications
      ),
    [profileMed?.allergies, prescription.medications]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const result = careSystemStore.dispensePrescription(prescription.id, {
        idLast4: idLast4.trim(),
        notes,
        pharmacistName: profile?.name || "الصيدلي",
        acknowledgeAllergy,
      });

      if (printAfter) {
        try {
          printDispenseReceipt({
            patientName,
            patientPhone: phone,
            nationalId,
            medications: prescription.medications,
            pharmacistName: profile?.name || "الصيدلي",
            dispensedAt: new Date().toISOString(),
            notes,
          });
        } catch (printError) {
          setError(printError.message);
        }
      }

      onSuccess?.({ ...prescription, ...result, patient: patientName });
      onClose();
    } catch (err) {
      setError(err.message || "تعذر إتمام الصرف");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="تأكيد صرف الوصفة" onClose={onClose} maxWidth="max-w-lg">
      <form className="space-y-4" onSubmit={handleSubmit} dir="rtl">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
          <p>
            <span className="font-bold text-slate-500">المريض: </span>
            <span className="font-extrabold text-blue-950">{patientName}</span>
          </p>
          <p className="mt-1">
            <span className="font-bold text-slate-500">الجوال: </span>
            <span dir="ltr" className="font-bold tabular-nums">
              {phone || "—"}
            </span>
          </p>
          <p className="mt-2 whitespace-pre-line text-slate-700">
            <span className="font-bold text-slate-500">الأدوية: </span>
            {prescription.medications}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
          <p className="text-xs font-bold text-slate-500">الحساسية المسجّلة</p>
          <p className="mt-1 font-semibold text-slate-800">{allergies}</p>
        </div>

        {allergyConflict ? (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-800">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-extrabold">تحذير تعارض محتمل</p>
              <p className="mt-1 text-xs font-semibold leading-5">
                الوصفة قد تتعارض مع حساسية المريض المسجّلة ({allergyConflict}).
              </p>
              <label className="mt-2 flex cursor-pointer items-start gap-2 text-xs font-bold">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-rose-600"
                  checked={acknowledgeAllergy}
                  onChange={(e) => setAcknowledgeAllergy(e.target.checked)}
                />
                تم التحقق وأريد المتابعة رغم التحذير
              </label>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-800">
            <ShieldCheck size={16} />
            لا يوجد تعارض حساسية ظاهر مع الأدوية الحالية
          </div>
        )}

        <label className="block space-y-1.5">
          <span className="text-sm font-bold text-slate-700">
            أدخل آخر 4 أرقام من رقم {verifyLabel} للتحقق
          </span>
          <input
            inputMode="numeric"
            maxLength={4}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-center text-lg font-extrabold tracking-[0.35em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="••••"
            value={idLast4}
            onChange={(e) => setIdLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-bold text-slate-700">ملاحظة الصرف (اختياري)</span>
          <textarea
            className="min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="مثال: تم الشرح للمريض"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
          <input
            type="checkbox"
            className="accent-blue-600"
            checked={printAfter}
            onChange={(e) => setPrintAfter(e.target.checked)}
          />
          <Printer size={16} className="text-blue-600" />
          طباعة إيصال الصرف بعد التأكيد
        </label>

        {error ? <p className="text-sm font-bold text-rose-600">{error}</p> : null}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            idLast4.length !== 4 ||
            (Boolean(allergyConflict) && !acknowledgeAllergy)
          }
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          <PackageCheck size={16} />
          {isSubmitting ? "جاري الصرف..." : "تأكيد الصرف"}
        </button>
      </form>
    </Modal>
  );
}

export default DispenseVerifyModal;
