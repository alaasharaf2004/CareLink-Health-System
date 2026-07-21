import { useEffect, useState } from "react";
import apiClient from "../../../lib/api/client";
import AdminTable, { AdminTableCell, AdminTableRow } from "../../admin/components/AdminTable";
import { useAuth } from "../../authentication/context/AuthContext";
import FadeUp from "../components/FadeUp";
import PatientPageHeader from "../components/PatientPageHeader";

function PatientMedicalRecordsPage() {
  useAuth();
  const [records, setRecords] = useState([]);
  const [labs, setLabs] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

    const reload = async () => {
      try {
        const response = await apiClient.get("/patient/medical-records");
        const list = response.data?.data ?? [];
        setRecords(list);
        setLabs(
          list.filter((record) => record.lab_tests)
        );
        setPrescriptions(
          list.filter((record) => record.medications)
        );
      } catch (err) {
        console.log(err);
        setRecords([]);
      }
    };

    useEffect(() => {
      reload();
    }, []);

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
                <AdminTableCell className="font-bold">
                  {record.doctor?.name || "—"}
                </AdminTableCell>
                <AdminTableCell>{record.diagnosis}</AdminTableCell>
                <AdminTableCell>{record.clinical_notes || record.notes || "—"}</AdminTableCell>
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
                  <AdminTableCell className="font-bold">
                    {lab.lab_tests}
                  </AdminTableCell>

                  <AdminTableCell>—</AdminTableCell>

                  <AdminTableCell>—</AdminTableCell>

                  <AdminTableCell>جاهز</AdminTableCell>
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
                <AdminTableCell className="font-bold">
                  {rx.medications}
                </AdminTableCell>

                <AdminTableCell>
                  {rx.doctor?.name || "—"}
                </AdminTableCell>

                <AdminTableCell>
                  تم إصدار الوصفة
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
