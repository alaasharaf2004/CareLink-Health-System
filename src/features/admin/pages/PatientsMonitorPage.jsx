import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client"; // تأكد من المسار الصحيح

const COLUMNS = [
  { key: "name", label: "الاسم" },
  { key: "phone", label: "الجوال" },
  { key: "email", label: "البريد" },
  { key: "account", label: "حساب ويب" },
  { key: "nationalId", label: "الهوية" },
];

function PatientsMonitorPage() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      // تأكد أن هذا الرابط يعيد قائمة المرضى من الباك إند
      const res = await apiClient.get("/admin/patients");
      setPatients(res.data.data || []);
    } catch (error) {
      showToast("خطأ في جلب بيانات المرضى", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="المرضى"
        description="عرض بيانات المرضى المسجلين في النظام."
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : patients.length === 0 ? (
        <EmptyState 
          icon={Users} 
          title="لا يوجد مرضى" 
          description="سيظهر المرضى هنا بمجرد تسجيلهم في النظام." 
        />
      ) : (
        <AdminTable columns={COLUMNS}>
          {patients.map((patient) => (
            <AdminTableRow key={patient.id}>
              <AdminTableCell className="font-bold text-blue-950">{patient.name}</AdminTableCell>
              <AdminTableCell dir="">{patient.phone || "—"}</AdminTableCell>
              <AdminTableCell dir="">{patient.email || "—"}</AdminTableCell>
              <AdminTableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${patient.has_web_account ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {patient.has_web_account ? "نعم" : "لا"}
                </span>
              </AdminTableCell>
              <AdminTableCell dir="">{patient.nationalId || "—"}</AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  );
}

export default PatientsMonitorPage;