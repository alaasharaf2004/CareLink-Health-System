import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Loader2, Users } from "lucide-react";

import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import FadeUp from "../../patient/components/FadeUp";
import DoctorPageHeader from "../components/DoctorPageHeader";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import apiClient from "../../../lib/api/client";

const COLUMNS = [
  { key: "patient", label: "المريض" },
  { key: "id", label: "رقم المريض" },
  { key: "phone", label: "الهاتف" },
  { key: "blood", label: "فصيلة الدم" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "إجراءات", className: "w-24" },
];

function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/doctor/patients");
      setPatients(response.data.data || []);
    } catch {
      showToast("خطأ في جلب قائمة المرضى", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <DoctorPageHeader
        title="الملف الطبي للمرضى"
        description="اضغط على اسم المريض لعرض وتعديل ملفه الطبي وتصدير البيانات."
      />

      <FadeUp index={1}>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : patients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <Users size={40} className="mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-500">لا يوجد مرضى حالياً</p>
          </div>
        ) : (
          <AdminTable columns={COLUMNS}>
            {patients.map((patient) => (
              <AdminTableRow key={patient.id}>
                <AdminTableCell className="font-bold text-blue-950">
                  {patient.full_name || "—"}
                </AdminTableCell>
                <AdminTableCell className="text-slate-600">
                  #{patient.id}
                </AdminTableCell>
                <AdminTableCell dir="ltr" className="text-slate-600">
                  {patient.phone || "—"}
                </AdminTableCell>
                <AdminTableCell className="text-slate-600">
                  {patient.blood_type || "—"}
                </AdminTableCell>
                <AdminTableCell>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    نشط
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  <Link
                    to={`/doctor/patients/${patient.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <Eye size={14} />
                    عرض
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

export default DoctorPatientsPage;