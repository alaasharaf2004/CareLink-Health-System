import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";

import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import FadeUp from "../../patient/components/FadeUp";
import DoctorPageHeader from "../components/DoctorPageHeader";
import apiClient from "../../../lib/api/client";

const COLUMNS = [
  { key: "patient", label: "المريض" },
  { key: "date", label: "الموعد" },
  { key: "type", label: "النوع" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "إجراءات", className: "w-40" },
];

const STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const TYPE_LABELS = {
  in_person: "حضوري",
  online: "أونلاين",
};

function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/doctor/appointments");
      // استخراج المصفوفة من response.data.data بناءً على الريسبونس الخاص بك
      setAppointments(response.data.data || []);
    } catch {
      showToast("خطأ في جلب المواعيد", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <DoctorPageHeader title="المواعيد" description="مواعيد مرضاك فقط — افتح الموعد للتشخيص والتحاليل والوصفة." />

      <FadeUp index={1}>
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center font-bold text-slate-500">
            لا توجد مواعيد حالياً
          </div>
        ) : (
          <AdminTable columns={COLUMNS}>
            {appointments.map((appointment) => {
              // جلب اسم المريض من علاقة patient.full_name
              const patientName = appointment.patient?.full_name || "مريض";
              
              // فصل التاريخ عن الوقت من scheduled_at (مثال: "2026-07-25 10:00:00")
              const [datePart, timePart] = appointment.scheduled_at 
                ? appointment.scheduled_at.split(" ") 
                : ["—", "—"];

              return (
                <AdminTableRow key={appointment.id}>
                  <AdminTableCell className="font-bold text-blue-950">
                    {patientName}
                  </AdminTableCell>
                  <AdminTableCell dir=" ">
                    {datePart} — {timePart ? timePart.slice(0, 5) : ""}
                  </AdminTableCell>
                  <AdminTableCell>
                    {TYPE_LABELS[appointment.type] || appointment.type}
                  </AdminTableCell>
                  <AdminTableCell>
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                      appointment.status === 'confirmed' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {STATUS_LABELS[appointment.status] || appointment.status}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell>
                    <Link
                      to={`/doctor/appointments/${appointment.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                    >
                      <Eye size={14} />
                      فتح الملف
                    </Link>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
          </AdminTable>
        )}
      </FadeUp>
    </div>
  );
}

export default DoctorAppointmentsPage;