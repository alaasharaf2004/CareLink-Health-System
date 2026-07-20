import { BarChart3 } from "lucide-react";

import Modal from "../../admin/components/Modal";

function ReceptionDaySummaryModal({ summary, onClose }) {
  if (!summary) return null;

  const cards = [
    { label: "إجمالي المواعيد", value: summary.total, tone: "text-[#101860]" },
    { label: "مكتمل", value: summary.completed, tone: "text-emerald-700" },
    { label: "ملغى", value: summary.cancelled, tone: "text-rose-700" },
    { label: "لم يحضر (مجدول)", value: summary.noShow, tone: "text-amber-700" },
    { label: "حضور / انتظار", value: summary.checkedIn, tone: "text-sky-700" },
    { label: "عند الطبيب", value: summary.withDoctor, tone: "text-blue-700" },
  ];

  return (
    <Modal title="ملخص اليوم" onClose={onClose} maxWidth="max-w-lg">
      <div className="space-y-4" dir="rtl">
        <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-800">
          <BarChart3 size={16} />
          تقرير سريع لتاريخ{" "}
          <span className="tabular-nums" dir="ltr">
            {summary.date}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <p className="text-[11px] font-bold text-slate-500">{card.label}</p>
              <p className={`mt-1 text-2xl font-black tabular-nums ${card.tone}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
          مختبر: {summary.awaitingLab} · أشعة: {summary.awaitingRadiology} · صيدلية:{" "}
          {summary.awaitingPharmacy}
        </div>
      </div>
    </Modal>
  );
}

export default ReceptionDaySummaryModal;
