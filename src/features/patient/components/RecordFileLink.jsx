import { FileText } from "lucide-react";

import { downloadDummyRecordFile } from "../utils/downloadDummyRecordFile";

function RecordFileLink({
  fileName,
  patientName,
  doctorName,
  diagnosis,
  notes,
  appointmentDate,
}) {
  const handleDownload = (event) => {
    event.preventDefault();
    downloadDummyRecordFile(fileName, {
      patientName,
      doctorName,
      diagnosis,
      notes,
      appointmentDate,
    });
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
      title="تحميل الملف"
    >
      <FileText size={15} />
      {fileName}
    </button>
  );
}

export default RecordFileLink;
