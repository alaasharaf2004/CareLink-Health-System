import { useEffect, useState } from "react";
import { Pill } from "lucide-react";

import AdminPageHeader from "../../admin/components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import EmptyState from "../../admin/components/EmptyState";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";

function PharmacyHomePage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const { toast, showToast, hideToast } = useToast();

  const reload = () => {
    const { patientName, doctorName } = careSystemStore.resolveNames();
    setPrescriptions(
      careSystemStore.listPrescriptions().map((rx) => ({
        ...rx,
        patient: patientName(rx.patientId),
        doctor: doctorName(rx.doctorId),
      }))
    );
  };

  useEffect(() => {
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  const dispense = (rx) => {
    careSystemStore.savePrescription({ ...rx, status: "dispensed", dispensedAt: new Date().toISOString() });
    careSystemStore.setAppointmentStatus(rx.appointmentId, "completed");
    careSystemStore.upsertVisit({
      appointmentId: rx.appointmentId,
      patientId: rx.patientId,
      doctorId: rx.doctorId,
      status: "completed",
      endedAt: new Date().toISOString(),
    });
    showToast("تم صرف الدواء وإنهاء الزيارة", "success");
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />
      <AdminPageHeader
        title="الصيدلية"
        description="مشاهدة الوصفات، صرف الدواء، وتحديث حالة الوصفة."
      />

      {prescriptions.length === 0 ? (
        <EmptyState icon={Pill} title="لا توجد وصفات" description="ستظهر وصفات الأطباء هنا." />
      ) : (
        <AdminTable
          columns={[
            { key: "patient", label: "المريض" },
            { key: "doctor", label: "الطبيب" },
            { key: "meds", label: "الأدوية" },
            { key: "status", label: "الحالة" },
            { key: "actions", label: "إجراء" },
          ]}
        >
          {prescriptions.map((rx) => (
            <AdminTableRow key={rx.id}>
              <AdminTableCell className="font-bold">{rx.patient}</AdminTableCell>
              <AdminTableCell>{rx.doctor}</AdminTableCell>
              <AdminTableCell>{rx.medications}</AdminTableCell>
              <AdminTableCell>
                {rx.status === "dispensed" ? "تم الصرف" : "بانتظار الصرف"}
              </AdminTableCell>
              <AdminTableCell>
                {rx.status !== "dispensed" && (
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                    onClick={() => dispense(rx)}
                  >
                    صرف الدواء
                  </button>
                )}
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  );
}

export default PharmacyHomePage;
