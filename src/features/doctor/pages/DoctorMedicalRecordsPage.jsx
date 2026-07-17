import { Link } from "react-router-dom";

import AdminTable, {
  AdminTableCell,
  AdminTableRow,
} from "../../admin/components/AdminTable";
import FadeUp from "../../patient/components/FadeUp";
import RecordFileLink from "../../patient/components/RecordFileLink";
import { RECORD_TYPE_LABELS } from "../../patient/constants/appointmentLabels";
import { formatArabicDateTime } from "../../patient/utils/formatDateTime";
import { staggerDelay } from "../../patient/utils/staggerDelay";
import DoctorPageHeader from "../components/DoctorPageHeader";
import { MOCK_DOCTOR_MEDICAL_RECORDS } from "../data/doctorMockData";

const COLUMNS = [
  { key: "patient", label: "اسم المريض" },
  { key: "date", label: "الموعد" },
  { key: "type", label: "نوع السجل" },
  { key: "diagnosis", label: "التشخيص" },
  { key: "notes", label: "ملاحظات" },
  { key: "file", label: "الملف" },
];

function DoctorMedicalRecordsPage() {
  return (
    <div className="space-y-6">
      <DoctorPageHeader
        title="السجلات الطبية"
        description="تقارير وسجلات المرضى بعد كل لقاء أو موعد."
      />

      <FadeUp index={1}>
        <AdminTable columns={COLUMNS}>
          {MOCK_DOCTOR_MEDICAL_RECORDS.map((record, index) => (
            <AdminTableRow
              key={record.id}
              className="opacity-0 animate-[formFadeUp_0.45s_ease_forwards]"
              style={{ animationDelay: staggerDelay(index, 0.05, 0.12) }}
            >
              <AdminTableCell>
                <Link
                  to={`/doctor/patients/${record.patient_id}`}
                  className="font-bold text-blue-950 transition-colors hover:text-blue-600"
                >
                  {record.patient_name}
                </Link>
              </AdminTableCell>
              <AdminTableCell dir="rtl">
                {formatArabicDateTime(record.appointment_date)}
              </AdminTableCell>
              <AdminTableCell>
                {RECORD_TYPE_LABELS[record.record_type] ?? record.record_type}
              </AdminTableCell>
              <AdminTableCell>{record.diagnosis}</AdminTableCell>
              <AdminTableCell>
                <p className="max-w-[200px] text-sm text-slate-600">
                  {record.notes}
                </p>
              </AdminTableCell>
              <AdminTableCell>
                <RecordFileLink
                  fileName={record.file_name}
                  patientName={record.patient_name}
                  diagnosis={record.diagnosis}
                  notes={record.notes}
                  appointmentDate={record.appointment_date}
                />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      </FadeUp>
    </div>
  );
}

export default DoctorMedicalRecordsPage;
