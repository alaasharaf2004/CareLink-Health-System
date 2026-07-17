import FadeUp from "../../patient/components/FadeUp";
import DoctorPageHeader from "../components/DoctorPageHeader";

function DoctorMedicalRecordsPage() {
  const records = [];

  return (
    <div className="space-y-6">
      <DoctorPageHeader
        title="السجلات الطبية"
        description="تقارير وسجلات المرضى بعد كل لقاء أو موعد."
      />

      <FadeUp index={1}>
        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <p className="font-bold text-slate-500">لا توجد سجلات طبية حالياً</p>
          </div>
        ) : null}
      </FadeUp>
    </div>
  );
}

export default DoctorMedicalRecordsPage;
