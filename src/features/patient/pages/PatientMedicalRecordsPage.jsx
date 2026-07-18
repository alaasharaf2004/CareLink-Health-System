import { useEffect, useState } from "react";

import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import { useAuth } from "../../authentication/context/AuthContext";
import { careSystemStore } from "../../care-system/data/careSystemStore";
import FadeUp from "../components/FadeUp";
import PatientPageHeader from "../components/PatientPageHeader";

function PatientMedicalRecordsPage() {
  const { profile } = useAuth();
  const [records, setRecords] = useState([]);
  const [labs, setLabs] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const reload = () => {
      const patientId =
        profile?.patientId ||
        careSystemStore.listPatients().find((p) => p.email === profile?.email)?.id ||
        "pat-1";
      const { doctorName } = careSystemStore.resolveNames();
      setRecords(
        careSystemStore
          .listVisits()
          .filter((visit) => visit.patientId === patientId && visit.diagnosis)
          .map((visit) => ({
            ...visit,
            doctor: doctorName(visit.doctorId),
          }))
      );
      setLabs(
        careSystemStore
          .listLabOrders()
          .filter((order) => order.patientId === patientId)
          .map((order) => ({
            ...order,
            doctor: doctorName(order.doctorId),
          }))
      );
      setPrescriptions(
        careSystemStore
          .listPrescriptions()
          .filter((rx) => rx.patientId === patientId)
          .map((rx) => ({
            ...rx,
            doctor: doctorName(rx.doctorId),
          }))
      );
    };
    reload();
    window.addEventListener("carelink-store-updated", reload);
    return () => window.removeEventListener("carelink-store-updated", reload);
  }, [profile?.email, profile?.patientId]);

  return (
    <div className="space-y-8">
      <PatientPageHeader
        title="السجلات والنتائج"
        description="تشخيصاتك، نتائج التحاليل، والوصفات الطبية."
      />

      <FadeUp index={1}>
        <h2 className="mb-3 text-lg font-extrabold text-blue-950">التشخيصات</h2>
        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center font-bold text-slate-500">
            لا توجد تشخيصات بعد
          </div>
        ) : (
          <AdminTable
            columns={[
              { key: "doctor", label: "الطبيب" },
              { key: "diagnosis", label: "التشخيص" },
              { key: "notes", label: "ملاحظات" },
            ]}
          >
            {records.map((record) => (
              <AdminTableRow key={record.id}>
                <AdminTableCell className="font-bold">{record.doctor}</AdminTableCell>
                <AdminTableCell>{record.diagnosis}</AdminTableCell>
                <AdminTableCell>{record.clinicalNotes || "—"}</AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </FadeUp>

      <FadeUp index={2}>
        <h2 className="mb-3 text-lg font-extrabold text-blue-950">نتائج التحاليل</h2>
        {labs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center font-bold text-slate-500">
            لا توجد نتائج تحاليل
          </div>
        ) : (
          <AdminTable
            columns={[
              { key: "tests", label: "التحاليل" },
              { key: "result", label: "النتيجة" },
              { key: "file", label: "الملف" },
              { key: "status", label: "الحالة" },
            ]}
          >
            {labs.map((lab) => (
              <AdminTableRow key={lab.id}>
                <AdminTableCell className="font-bold">{lab.tests}</AdminTableCell>
                <AdminTableCell>{lab.resultText || "—"}</AdminTableCell>
                <AdminTableCell>{lab.pdfName || "—"}</AdminTableCell>
                <AdminTableCell>
                  {lab.status === "completed" ? "جاهز" : "قيد التنفيذ"}
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </FadeUp>

      <FadeUp index={3}>
        <h2 className="mb-3 text-lg font-extrabold text-blue-950">الوصفات</h2>
        {prescriptions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center font-bold text-slate-500">
            لا توجد وصفات
          </div>
        ) : (
          <AdminTable
            columns={[
              { key: "meds", label: "الأدوية" },
              { key: "doctor", label: "الطبيب" },
              { key: "status", label: "الحالة" },
            ]}
          >
            {prescriptions.map((rx) => (
              <AdminTableRow key={rx.id}>
                <AdminTableCell className="font-bold">{rx.medications}</AdminTableCell>
                <AdminTableCell>{rx.doctor}</AdminTableCell>
                <AdminTableCell>
                  {rx.status === "dispensed" ? "تم الصرف" : "بانتظار الصرف"}
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        )}
      </FadeUp>
    </div>
  );
}

export default PatientMedicalRecordsPage;
