import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { useAuth } from "../../authentication/context/AuthContext";
import {
  APPOINTMENT_STATUS_LABELS,
  careSystemStore,
} from "../../care-system/data/careSystemStore";
import FadeUp from "../../patient/components/FadeUp";
import DoctorPageHeader from "../components/DoctorPageHeader";

const COLUMNS = [
  { key: "patient", label: "المريض" },
  { key: "date", label: "الموعد" },
  { key: "type", label: "النوع" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "إجراءات", className: "w-40" },
];

function DoctorAppointmentsPage() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const { toast, showToast, hideToast } = useToast();

  const reload = () => {
    const doctor =
      careSystemStore.listStaff("doctor").find((d) => d.id === profile?.staffId) ||
      careSystemStore.listStaff("doctor").find((d) => d.email === profile?.email) ||
      careSystemStore.listStaff("doctor").find((d) => d.email === "ahmed.heart@carelink.com") ||
      careSystemStore.listStaff("doctor")[0];
    const doctorId = doctor?.id;
    const { patientName } = careSystemStore.resolveNames();
    setAppointments(
      careSystemStore
        .listAppointments()
        .filter((apt) => !doctorId || apt.doctorId === doctorId)
        .map((apt) => ({
          ...apt,
          patient: patientName(apt.patientId),
        }))
    );
  };

  useEffect(() => {
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <DoctorPageHeader title="المواعيد" description="مواعيد مرضاك فقط — افتح الموعد للتشخيص والتحاليل والوصفة." />

      <FadeUp index={1}>
        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center font-bold text-slate-500">
            لا توجد مواعيد حالياً
          </div>
        ) : (
          <AdminTable columns={COLUMNS}>
            {appointments.map((appointment) => (
              <AdminTableRow key={appointment.id}>
                <AdminTableCell className="font-bold text-blue-950">
                  {appointment.patient}
                </AdminTableCell>
                <AdminTableCell>
                  {appointment.date} — {appointment.time}
                </AdminTableCell>
                <AdminTableCell>{appointment.type}</AdminTableCell>
                <AdminTableCell>
                  {APPOINTMENT_STATUS_LABELS[appointment.status] || appointment.status}
                </AdminTableCell>
                <AdminTableCell>
                  <Link
                    to={`/doctor/appointments/${appointment.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                    onClick={() => showToast("فتح ملف الموعد", "success")}
                  >
                    <Eye size={14} />
                    فتح الملف
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

export default DoctorAppointmentsPage;
