import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import EmptyState from "../components/EmptyState";
import {
  APPOINTMENT_STATUS_LABELS,
  careSystemStore,
} from "../../care-system/data/careSystemStore";

const COLUMNS = [
  { key: "patient", label: "المريض" },
  { key: "doctor", label: "الطبيب" },
  { key: "datetime", label: "الموعد" },
  { key: "type", label: "النوع" },
  { key: "status", label: "الحالة" },
  { key: "source", label: "المصدر" },
];

function AppointmentsMonitorPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const reload = () => {
      const { patientName, doctorName } = careSystemStore.resolveNames();
      setRows(
        careSystemStore.listAppointments().map((apt) => ({
          ...apt,
          patient: patientName(apt.patientId),
          doctor: doctorName(apt.doctorId),
        }))
      );
    };
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="المواعيد"
        description="عرض جميع مواعيد النظام (قراءة فقط)."
      />

      {rows.length === 0 ? (
        <EmptyState icon={CalendarDays} title="لا توجد مواعيد" description="ستظهر المواعيد هنا بعد إنشائها." />
      ) : (
        <AdminTable columns={COLUMNS}>
          {rows.map((apt) => (
            <AdminTableRow key={apt.id}>
              <AdminTableCell className="font-bold text-blue-950">{apt.patient}</AdminTableCell>
              <AdminTableCell>{apt.doctor}</AdminTableCell>
              <AdminTableCell>
                {apt.date} — {apt.time}
              </AdminTableCell>
              <AdminTableCell>{apt.type}</AdminTableCell>
              <AdminTableCell>
                {APPOINTMENT_STATUS_LABELS[apt.status] || apt.status}
              </AdminTableCell>
              <AdminTableCell>
                {apt.createdBy === "reception" ? "استقبال" : "مريض"}
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  );
}

export default AppointmentsMonitorPage;
