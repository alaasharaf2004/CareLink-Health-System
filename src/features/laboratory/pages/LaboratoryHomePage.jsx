import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";

import AdminPageHeader from "../../admin/components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import EmptyState from "../../admin/components/EmptyState";
import Modal from "../../admin/components/Modal";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";

function LaboratoryHomePage() {
  const [orders, setOrders] = useState([]);
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
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

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
    <div>
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="المختبر"
        description="مشاهدة طلبات التحاليل، إدخال النتائج، ورفع PDF وإرسالها للطبيب."
      />

      {orders.length === 0 ? (
        <EmptyState icon={FlaskConical} title="لا توجد طلبات" description="ستظهر طلبات الأطباء هنا." />
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
          {orders.map((order) => (
            <AdminTableRow key={order.id}>
              <AdminTableCell className="font-bold">{order.patient}</AdminTableCell>
              <AdminTableCell>{order.doctor}</AdminTableCell>
              <AdminTableCell>{order.tests}</AdminTableCell>
              <AdminTableCell>
                {order.status === "completed" ? "مكتمل" : "قيد الانتظار"}
              </AdminTableCell>
              <AdminTableCell>
                {order.status !== "completed" && (
                  <button
                    type="button"
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                    onClick={() => {
                      setEditing(order);
                      setResultText(order.resultText || "");
                      setPdfName(order.pdfName || "");
                    }}
                  >
                    إدخال نتيجة
                  </button>
                )}
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {editing && (
        <Modal title="إدخال نتيجة التحليل" onClose={() => setEditing(null)}>
          <form className="space-y-3" onSubmit={submitResults}>
            <p className="text-sm text-slate-500">التحاليل: {editing.tests}</p>
            <textarea
              className="min-h-28 w-full rounded-xl border px-3 py-2 text-sm"
              placeholder="نص النتيجة"
              value={resultText}
              onChange={(e) => setResultText(e.target.value)}
              required
            />
            <input
              type="file"
              accept="application/pdf"
              className="w-full text-sm"
              onChange={(e) => setPdfName(e.target.files?.[0]?.name || "")}
            />
            {pdfName && <p className="text-xs font-bold text-emerald-700">تم اختيار: {pdfName}</p>}
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white">
              حفظ وإرسال للطبيب
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default LaboratoryHomePage;
