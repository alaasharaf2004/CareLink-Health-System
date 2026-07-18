import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Eye, MessageSquare, XCircle } from "lucide-react";

import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import Modal from "../../admin/components/Modal";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { AppointmentStatusBadge, AppointmentTypeBadge } from "../../patient/components/AppointmentBadges";
import FadeUp from "../../patient/components/FadeUp";
import ProfileAvatar from "../../patient/components/ProfileAvatar";
import { formatArabicDateTime } from "../../patient/utils/formatDateTime";
import { staggerDelay } from "../../patient/utils/staggerDelay";
import DoctorPageHeader from "../components/DoctorPageHeader";
import apiClient from "../../../lib/api/client"; // التأكد من المسار الصحيح

const COLUMNS = [
  { key: "patient", label: "المريض" },
  { key: "date", label: "الموعد" },
  { key: "type", label: "النوع" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "إجراءات", className: "w-40" },
];

function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [targetAppointment, setTargetAppointment] = useState(null); // الموعد المستهدف (قبول/رفض/رسالة)
  const [modalType, setModalType] = useState(null); // 'accept', 'reject', 'message'
  const [messageText, setMessageText] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/doctor/appointments");
      setAppointments(response.data.data);
    } catch (error) {
      showToast("خطأ في جلب المواعيد", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const filteredAppointments = activeFilter === "all" 
    ? appointments 
    : appointments.filter((a) => a.status === activeFilter);

  const handleStatusChange = async (status) => {
    try {
      await apiClient.put(`/doctor/appointments/${targetAppointment.id}/status`, {
        status: status,
        message: messageText
      });
      showToast("تم تحديث الموعد بنجاح", "success");
      fetchAppointments();
      setTargetAppointment(null);
      setMessageText("");
    } catch (error) {
      showToast("حدث خطأ أثناء التحديث", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <DoctorPageHeader title="المواعيد" description="إدارة مواعيد المرضى." />

      {isLoading ? (
        <div className="text-center py-10">جاري تحميل المواعيد...</div>
      ) : (
        <FadeUp index={1}>
           <AdminTable columns={COLUMNS}>
            {filteredAppointments.map((appointment) => (
              <AdminTableRow key={appointment.id}>
                <AdminTableCell>
                  <p className="font-bold">{appointment.patient_name}</p>
                </AdminTableCell>
                <AdminTableCell>{formatArabicDateTime(appointment.scheduled_at)}</AdminTableCell>
                <AdminTableCell><AppointmentTypeBadge type={appointment.type} /></AdminTableCell>
                <AdminTableCell><AppointmentStatusBadge status={appointment.status} /></AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-1">
                    <button onClick={() => { setTargetAppointment(appointment); setModalType('message'); }} className="p-2 text-slate-500 hover:bg-violet-50"><MessageSquare size={17} /></button>
                    {appointment.status === "pending" && (
                      <>
                        <button onClick={() => { setTargetAppointment(appointment); setModalType('accept'); }} className="p-2 text-emerald-600 hover:bg-emerald-50"><CheckCircle2 size={17} /></button>
                        <button onClick={() => { setTargetAppointment(appointment); setModalType('reject'); }} className="p-2 text-red-500 hover:bg-red-50"><XCircle size={17} /></button>
                      </>
                    )}
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        </FadeUp>
      )}

      {targetAppointment && (
        <Modal title={modalType === 'accept' ? 'قبول' : modalType === 'reject' ? 'رفض' : 'رسالة'} onClose={() => setTargetAppointment(null)}>
          <textarea 
            value={messageText} 
            onChange={(e) => setMessageText(e.target.value)} 
            className="w-full p-3 border rounded-xl" 
            placeholder="اكتب رسالتك للمريض..." 
          />
          <button onClick={() => handleStatusChange(modalType === 'accept' ? 'confirmed' : 'cancelled')} className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl">تنفيذ</button>
        </Modal>
      )}
    </div>
  );
}

export default DoctorAppointmentsPage;