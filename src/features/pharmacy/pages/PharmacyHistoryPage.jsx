import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Printer, Search } from "lucide-react";

import AdminPageHeader from "../../admin/components/AdminPageHeader";
import EmptyState from "../../admin/components/EmptyState";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";
import { printDispenseReceipt } from "../utils/printDispenseReceipt";

function PharmacyHistoryPage() {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const reload = () => {
    const { doctorName } = careSystemStore.resolveNames();
    setLogs(
      careSystemStore.listDispenseLogs().map((item) => ({
        ...item,
        doctor: doctorName(item.doctorId),
      }))
    );
  };

  useEffect(() => {
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter((item) => {
      const haystack = `${item.patientName} ${item.patientPhone} ${item.medications} ${item.pharmacistName} ${item.notes}`
        .toLowerCase()
        .replace(/\s+/g, " ");
      return haystack.includes(q) || String(item.nationalId || "").includes(q);
    });
  }, [logs, query]);

  return (
    <div className="space-y-6" dir="rtl">
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="سجل الصرف"
        description="تاريخ عمليات الصرف: من استلم، ماذا، ومتى — مع إمكانية إعادة طباعة الإيصال."
      />

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
        <Search size={16} className="text-slate-400" />
        <input
          className="h-11 w-full bg-transparent text-sm outline-none"
          placeholder="ابحث باسم المريض أو الجوال أو الدواء..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="لا يوجد سجل صرف بعد"
          description="عند صرف أي وصفة ستُسجَّل هنا تلقائياً مع وقت العملية وبيانات التحقق."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-blue-950">{item.patientName}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {item.patientPhone ? (
                      <>
                        <span dir="ltr" className="tabular-nums">
                          {item.patientPhone}
                        </span>
                        {" · "}
                      </>
                    ) : null}
                    صرف بواسطة: {item.pharmacistName}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                  {item.dispensedAt
                    ? new Date(item.dispensedAt).toLocaleString("ar")
                    : "—"}
                </span>
              </div>

              <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 whitespace-pre-line">
                {item.medications}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
                <span className="rounded-lg bg-slate-100 px-2 py-1">
                  تحقق عبر: {item.verifyMethod === "national_id" ? "الهوية" : "الجوال"}
                </span>
                {item.allergyWarning ? (
                  <span className="rounded-lg bg-rose-50 px-2 py-1 text-rose-700">
                    حساسية: {item.allergyWarning}
                    {item.allergyOverridden ? " (تمت المتابعة)" : ""}
                  </span>
                ) : null}
                {item.notes ? (
                  <span className="rounded-lg bg-blue-50 px-2 py-1 text-blue-700">
                    ملاحظة: {item.notes}
                  </span>
                ) : null}
                <button
                  type="button"
                  className="ms-auto inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800"
                  onClick={() => {
                    try {
                      printDispenseReceipt({
                        patientName: item.patientName,
                        patientPhone: item.patientPhone,
                        nationalId: item.nationalId,
                        medications: item.medications,
                        pharmacistName: item.pharmacistName,
                        dispensedAt: item.dispensedAt,
                        notes: item.notes,
                      });
                    } catch (error) {
                      showToast(error.message || "تعذر الطباعة", "error");
                    }
                  }}
                >
                  <Printer size={12} />
                  طباعة الإيصال
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default PharmacyHistoryPage;
