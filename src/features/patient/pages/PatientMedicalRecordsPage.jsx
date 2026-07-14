import { FileText } from "lucide-react";

import AdminTable, {
  AdminTableCell,
  AdminTableRow,
} from "../../admin/components/AdminTable";
import FadeUp from "../components/FadeUp";
import PatientPageHeader from "../components/PatientPageHeader";
import { RECORD_TYPE_LABELS } from "../constants/appointmentLabels";
import {
  MOCK_MEDICAL_RECORDS,
  MOCK_PATIENT_PROFILE,
} from "../data/patientMockData";
import { formatArabicDateTime } from "../utils/formatDateTime";
import { staggerDelay } from "../utils/staggerDelay";

const COLUMNS = [
  { key: "doctor", label: "اسم الطبيب" },
  { key: "date", label: "الموعد" },
  { key: "type", label: "نوع السجل" },
  { key: "diagnosis", label: "التشخيص" },
  { key: "notes", label: "ملاحظات" },
  { key: "file", label: "الملف" },
];

function PatientMedicalRecordsPage() {
  const myRecords = MOCK_MEDICAL_RECORDS.filter(
    (r) => r.patient_name === MOCK_PATIENT_PROFILE.name
  );

  return (
    <div className="space-y-6">
      <PatientPageHeader
        title="السجلات الطبية"
        description="تقارير وسجلاتك الطبية بعد كل لقاء أو موعد."
      />

      <FadeUp index={1}>
        <AdminTable columns={COLUMNS}>
          {myRecords.map((record, index) => (
            <AdminTableRow
              key={record.id}
              className="opacity-0 animate-[formFadeUp_0.45s_ease_forwards]"
              style={{ animationDelay: staggerDelay(index, 0.05, 0.12) }}
            >
              <AdminTableCell className="font-bold text-blue-950">
                {record.doctor_name}
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
                <a
                  href={record.file_url}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
                >
                  <FileText size={15} />
                  {record.file_name}
                </a>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      </FadeUp>
    </div>
  );
}

export default PatientMedicalRecordsPage;
