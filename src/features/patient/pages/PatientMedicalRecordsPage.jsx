import AdminTable from "../../admin/components/AdminTable";
import FadeUp from "../components/FadeUp";
import PatientPageHeader from "../components/PatientPageHeader";

const COLUMNS = [
  { key: "doctor", label: "اسم الطبيب" },
  { key: "date", label: "الموعد" },
  { key: "type", label: "نوع السجل" },
  { key: "diagnosis", label: "التشخيص" },
  { key: "notes", label: "ملاحظات" },
  { key: "file", label: "الملف" },
];

function PatientMedicalRecordsPage() {
  const myRecords = [];

  return (
    <div className="space-y-6">
      <PatientPageHeader
        title="السجلات الطبية"
        description="تقارير وسجلاتك الطبية بعد كل لقاء أو موعد."
      />

      <FadeUp index={1}>
        {myRecords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <p className="font-bold text-slate-500">لا توجد سجلات طبية حالياً</p>
          </div>
        ) : (
          <AdminTable columns={COLUMNS}>{null}</AdminTable>
        )}
      </FadeUp>
    </div>
  );
}

export default PatientMedicalRecordsPage;
