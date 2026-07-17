import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

import AdminTable, {
  AdminTableCell,
  AdminTableRow,
} from "../../admin/components/AdminTable";
import FadeUp from "../../patient/components/FadeUp";
import ProfileAvatar from "../../patient/components/ProfileAvatar";
import { formatArabicDateTime } from "../../patient/utils/formatDateTime";
import { staggerDelay } from "../../patient/utils/staggerDelay";
import DoctorPageHeader from "../components/DoctorPageHeader";
import { MOCK_PATIENTS } from "../data/doctorMockData";

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
  return (
    <div className="space-y-6">
      <DoctorPageHeader
        title="الملف الطبي للمرضى"
        description="اضغط على اسم المريض لعرض وتعديل ملفه الطبي وتصدير البيانات."
      />

      <FadeUp index={1}>
        <AdminTable columns={COLUMNS}>
          {MOCK_PATIENTS.map((patient, index) => (
            <AdminTableRow
              key={patient.id}
              className="opacity-0 animate-[formFadeUp_0.45s_ease_forwards]"
              style={{ animationDelay: staggerDelay(index, 0.05, 0.12) }}
            >
              <AdminTableCell>
                <Link
                  to={`/doctor/patients/${patient.id}`}
                  className="flex items-center gap-3 transition-opacity hover:opacity-80"
                >
                  <ProfileAvatar
                    src={patient.profile_picture}
                    name={patient.name}
                    size="md"
                  />
                  <div>
                    <p className="font-bold text-blue-950">{patient.name}</p>
                    <p className="text-xs text-slate-400">
                      {patient.age} سنة ·{" "}
                      {patient.gender === "male" ? "ذكر" : "أنثى"}
                    </p>
                  </div>
                </Link>
              </AdminTableCell>
              <AdminTableCell className="font-semibold text-slate-600" dir="ltr">
                {patient.id}
              </AdminTableCell>
              <AdminTableCell dir="ltr">{patient.phone}</AdminTableCell>
              <AdminTableCell>
                <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-extrabold text-red-600">
                  {patient.medical.blood_type}
                </span>
              </AdminTableCell>
              <AdminTableCell dir="rtl">
                {formatArabicDateTime(patient.last_visit)}
              </AdminTableCell>
              <AdminTableCell>
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  نشط
                </span>
              </AdminTableCell>
              <AdminTableCell>
                <Link
                  to={`/doctor/patients/${patient.id}`}
                  className="rounded-lg p-2 text-slate-500 transition-all duration-200 hover:scale-110 hover:bg-blue-50 hover:text-blue-700"
                  title="عرض الملف"
                >
                  <Eye size={17} />
                </Link>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      </FadeUp>
    </div>
  );
}

export default DoctorPatientsPage;
