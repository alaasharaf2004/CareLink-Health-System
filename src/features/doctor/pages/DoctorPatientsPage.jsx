import AdminTable from "../../admin/components/AdminTable";
import FadeUp from "../../patient/components/FadeUp";
import DoctorPageHeader from "../components/DoctorPageHeader";

const COLUMNS = [
  { key: "patient", label: "المريض" },
  { key: "id", label: "رقم المريض" },
  { key: "phone", label: "الهاتف" },
  { key: "blood", label: "فصيلة الدم" },
  { key: "last", label: "آخر زيارة" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "إجراءات", className: "w-24" },
];

function DoctorPatientsPage() {
  const patients = [];

  return (
    <div className="space-y-6">
      <DoctorPageHeader
        title="الملف الطبي للمرضى"
        description="اضغط على اسم المريض لعرض وتعديل ملفه الطبي وتصدير البيانات."
      />

      <FadeUp index={1}>
        {patients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <p className="font-bold text-slate-500">لا يوجد مرضى حالياً</p>
          </div>
        ) : (
          <AdminTable columns={COLUMNS}>{null}</AdminTable>
        )}
      </FadeUp>
    </div>
  );
}

export default DoctorPatientsPage;
