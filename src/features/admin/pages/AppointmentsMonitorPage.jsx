import { useEffect, useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import apiClient from "../../../lib/api/client";

const COLUMNS = [
  { key: "patient", label: "المريض" },
  { key: "datetime", label: "تاريخ ووقت الموعد" },
  { key: "type", label: "النوع" },
  { key: "status", label: "الحالة" },
];

function AppointmentsMonitorPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      // رابط الـ API الخاص بك
      const res = await apiClient.get("/admin/appointments");
      setAppointments(res.data.data || []);
    } catch (error) {
      showToast("خطأ في جلب بيانات المواعيد", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // دالة مساعدة لتنسيق التاريخ
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-EG', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="المواعيد"
        description="عرض جميع مواعيد النظام."
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : appointments.length === 0 ? (
        <EmptyState icon={CalendarDays} title="لا توجد مواعيد" description="ستظهر المواعيد هنا بعد إنشائها." />
      ) : (
        <AdminTable columns={COLUMNS}>
          {appointments.map((apt) => (
            <AdminTableRow key={apt.id}>
              {/* الوصول لاسم المريض من داخل كائن patient */}
              <AdminTableCell className="font-bold text-blue-950">
                {apt.patient?.full_name || "غير محدد"}
              </AdminTableCell>
              
              {/* تنسيق الوقت المدمج */}
              <AdminTableCell dir="">
                {formatDateTime(apt.scheduled_at)}
              </AdminTableCell>
              
              <AdminTableCell>
                {apt.type === 'in_person' ? 'حضور شخصي' : 'عن بعد'}
              </AdminTableCell>
              
              <AdminTableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {apt.status === 'confirmed' ? 'مؤكد' : apt.status}
                </span>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  );
}

export default AppointmentsMonitorPage;