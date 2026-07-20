import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";

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
  ...APPOINTMENT_STATUS_LABELS,
};

const TYPE_LABELS = {
  in_person: "حضوري",
  online: "أونلاين",
  حضوري: "حضوري",
  "عن بُعد": "أونلاين",
};

function mapLocalAppointment(apt, patientName) {
  const type =
    apt.type === "عن بُعد" || apt.type === "online" ? "online" : "in_person";

  return {
    id: apt.id,
    patient: { full_name: patientName(apt.patientId) },
    scheduled_at: `${apt.date} ${apt.time || "00:00"}`,
    type,
    status: apt.status,
  };
}

function DoctorAppointmentsPage() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast, showToast, hideToast } = useToast();

  const loadLocalAppointments = () => {
    const doctorId =
      profile?.staffId ||
      careSystemStore.listStaff("doctor").find((d) => d.email === profile?.email)?.id;

    const { patientName } = careSystemStore.resolveNames();
    const list = careSystemStore
      .listAppointments()
      .filter((apt) => !doctorId || apt.doctorId === doctorId)
      .map((apt) => mapLocalAppointment(apt, patientName));

    setAppointments(list);
  };

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/doctor/appointments");
      const raw = response.data?.data ?? response.data ?? [];
      setAppointments(Array.isArray(raw) ? raw : []);
    } catch {
      loadLocalAppointments();
      showToast("تعذر الاتصال بالخادم — عرض المواعيد المحلية", "info");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />
      <DoctorPageHeader
        title="المواعيد"
        description="مواعيد مرضاك فقط — افتح الموعد للتشخيص والتحاليل والوصفة والمحادثة."
      />

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
              const patientName = appointment.patient?.full_name || "مريض";

              const [datePart, timePart] = appointment.scheduled_at
                ? appointment.scheduled_at.replace("T", " ").split(" ")
                : ["—", "—"];

              return (
                <AdminTableRow key={appointment.id}>
                  <AdminTableCell className="font-bold text-blue-950">
                    {patientName}
                  </AdminTableCell>
                  <AdminTableCell dir="ltr">
                    {datePart} — {timePart ? timePart.slice(0, 5) : ""}
                  </AdminTableCell>
                  <AdminTableCell>
                    {TYPE_LABELS[appointment.type] || appointment.type}
                  </AdminTableCell>
                  <AdminTableCell>
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                        appointment.status === "confirmed" ||
                        appointment.status === "with_doctor" ||
                        appointment.status === "scheduled"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
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
