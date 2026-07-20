import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileText,
  FlaskConical,
  Send,
} from "lucide-react";

import AdminPageHeader from "../../admin/components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import EmptyState from "../../admin/components/EmptyState";
import Modal from "../../admin/components/Modal";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";

const FILTERS = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "completed", label: "مكتمل" },
];

function LaboratoryHomePage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [editing, setEditing] = useState(null);
  const [resultText, setResultText] = useState("");
  const [pdfName, setPdfName] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const reload = () => {
    const { patientName, doctorName } = careSystemStore.resolveNames();
    setOrders(
      careSystemStore.listLabOrders().map((order) => ({
        ...order,
        patient: patientName(order.patientId),
        doctor: doctorName(order.doctorId),
      }))
    );
  };

  useEffect(() => {
    reload();
    const onStorage = (event) => {
      if (event.key === "carelink_care_system_v2" || event.key === null) reload();
    };
    window.addEventListener("carelink-store-updated", reload);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("carelink-store-updated", reload);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const pendingCount = orders.filter((order) => order.status !== "completed").length;
  const completedCount = orders.filter((order) => order.status === "completed").length;

  const filteredOrders = useMemo(() => {
    if (filter === "pending") return orders.filter((order) => order.status !== "completed");
    if (filter === "completed") return orders.filter((order) => order.status === "completed");
    return orders;
  }, [orders, filter]);

  const submitResults = (event) => {
    event.preventDefault();
    careSystemStore.saveLabOrder({
      ...editing,
      resultText,
      pdfName: pdfName || editing.pdfName || "",
      status: "completed",
      completedAt: new Date().toISOString(),
    });
    careSystemStore.setAppointmentStatus(editing.appointmentId, "results_ready");
    careSystemStore.upsertVisit({
      appointmentId: editing.appointmentId,
      patientId: editing.patientId,
      doctorId: editing.doctorId,
      status: "results_ready",
    });
    showToast("تم إرسال النتيجة للطبيب", "success");
    setEditing(null);
    setResultText("");
    setPdfName("");
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="لوحة المختبر"
        description="استقبل طلبات التحاليل من الأطباء، أدخل النتائج، وأرسلها لإكمال مسار الزيارة."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">إجمالي الطلبات</p>
            <FlaskConical size={18} className="text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-black text-[#101860]">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-amber-700">قيد الانتظار</p>
            <Clock3 size={18} className="text-amber-600" />
          </div>
          <p className="mt-3 text-3xl font-black text-amber-800">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-700">مكتمل</p>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <p className="mt-3 text-3xl font-black text-emerald-800">{completedCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              filter === item.value
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="لا توجد طلبات في هذا القسم"
          description="عندما يطلب الطبيب تحاليل، ستظهر هنا لإدخال النتيجة."
        />
      ) : (
        <AdminTable
          columns={[
            { key: "patient", label: "المريض" },
            { key: "doctor", label: "الطبيب" },
            { key: "tests", label: "التحاليل" },
            { key: "status", label: "الحالة" },
            { key: "actions", label: "إجراء" },
          ]}
        >
          {filteredOrders.map((order) => (
            <AdminTableRow key={order.id}>
              <AdminTableCell className="font-bold text-blue-950">{order.patient}</AdminTableCell>
              <AdminTableCell>{order.doctor}</AdminTableCell>
              <AdminTableCell className="max-w-xs">
                <span className="line-clamp-2">{order.tests}</span>
              </AdminTableCell>
              <AdminTableCell>
                {order.status === "completed" ? (
                  <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                    مكتمل
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                    قيد الانتظار
                  </span>
                )}
              </AdminTableCell>
              <AdminTableCell>
                {order.status !== "completed" ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                    onClick={() => {
                      setEditing(order);
                      setResultText(order.resultText || "");
                      setPdfName(order.pdfName || "");
                    }}
                  >
                    <FileText size={14} />
                    إدخال نتيجة
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">تم الإرسال</span>
                )}
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {editing && (
        <Modal title="إدخال نتيجة التحليل" onClose={() => setEditing(null)} maxWidth="max-w-xl">
          <form className="space-y-4" onSubmit={submitResults} dir="rtl">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <p>
                <span className="font-bold text-slate-500">المريض: </span>
                {editing.patient}
              </p>
              <p className="mt-1">
                <span className="font-bold text-slate-500">الطبيب: </span>
                {editing.doctor}
              </p>
              <p className="mt-1">
                <span className="font-bold text-slate-500">التحاليل: </span>
                {editing.tests}
              </p>
            </div>

            <textarea
              className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="اكتب نص النتيجة الطبية..."
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              required
            />

            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-slate-600">رفع تقرير PDF (اختياري)</span>
              <input
                type="file"
                accept="application/pdf"
                className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-3 py-3 text-sm"
                onChange={(e) => setPdfName(e.target.files?.[0]?.name || "")}
              />
            </label>
            {pdfName && (
              <p className="text-xs font-bold text-emerald-700">تم اختيار: {pdfName}</p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Send size={16} />
              حفظ وإرسال للطبيب
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default LaboratoryHomePage;
