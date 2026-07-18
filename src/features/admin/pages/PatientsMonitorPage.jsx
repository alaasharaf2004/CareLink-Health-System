import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, { AdminTableCell, AdminTableRow } from "../components/AdminTable";
import EmptyState from "../components/EmptyState";
import { careSystemStore } from "../../care-system/data/careSystemStore";

const COLUMNS = [
  { key: "name", label: "الاسم" },
  { key: "phone", label: "الجوال" },
  { key: "email", label: "البريد" },
  { key: "account", label: "حساب ويب" },
  { key: "nationalId", label: "الهوية" },
];

function PatientsMonitorPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const reload = () => setPatients(careSystemStore.listPatients());
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="المرضى"
        description="عرض بيانات المرضى المسجلين (قراءة فقط)."
      />

      {patients.length === 0 ? (
        <EmptyState icon={Users} title="لا يوجد مرضى" description="سيظهر المرضى هنا بعد تسجيلهم." />
      ) : (
        <AdminTable columns={COLUMNS}>
          {patients.map((patient) => (
            <AdminTableRow key={patient.id}>
              <AdminTableCell className="font-bold text-blue-950">{patient.name}</AdminTableCell>
              <AdminTableCell dir="ltr">{patient.phone || "—"}</AdminTableCell>
              <AdminTableCell dir="ltr">{patient.email || "—"}</AdminTableCell>
              <AdminTableCell>{patient.hasWebAccount ? "نعم" : "لا"}</AdminTableCell>
              <AdminTableCell dir="ltr">{patient.nationalId || "—"}</AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}
    </div>
  );
}

export default PatientsMonitorPage;
