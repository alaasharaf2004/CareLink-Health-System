import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Loader2, FileText } from "lucide-react";

import FadeUp from "../../patient/components/FadeUp";
import DoctorPageHeader from "../components/DoctorPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import apiClient from "../../../lib/api/client";

const COLUMNS = [
  { key: "patient", label: "المريض" },
  { key: "date", label: "موعد اللقاء" },
  { key: "diagnosis", label: "التشخيص المسجل" },
  { key: "actions", label: "إجراءات", className: "w-36" },
];

function DoctorMedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      // طلب عام للسجلات بدون ID محدد
      const response = await apiClient.get("/doctor/medical-records");
      setRecords(response.data.data || []);
    } catch {
      showToast("خطأ في جلب السجلات الطبية", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <DoctorPageHeader
        title="السجلات الطبية"
        description="قائمة بجميع السجلات والتشخيصات الطبية لمرضاك."
      />

      <FadeUp index={1}>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <FileText size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-500">لا توجد سجلات طبية مسجلة حالياً</p>
          </div>
        ) : (
          <AdminTable columns={COLUMNS}>
            {records.map((record) => (
              <AdminTableRow key={record.id}>
                <AdminTableCell className="font-bold text-blue-950">
                  {record.patient?.full_name || "مريض"}
                </AdminTableCell>
                <AdminTableCell dir="ltr">
                  {record.scheduled_at}
                </AdminTableCell>
                <AdminTableCell className="text-slate-600 truncate max-w-xs">
                  {record.diagnosis || "—"}
                </AdminTableCell>
                <AdminTableCell>
                  <Link
                    to={`/doctor/appointments/${record.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <Eye size={14} />
                    عرض التفاصيل
                  </Link>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </FadeUp>
    </div>
  );
}

export default DoctorMedicalRecordsPage;