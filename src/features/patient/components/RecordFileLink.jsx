import { FileText } from "lucide-react";

function RecordFileLink({ fileName, fileUrl }) {
  if (!fileUrl) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400"
        title="لا يوجد ملف"
      >
        <FileText size={15} />
        {fileName || "لا يوجد ملف"}
      </span>
    );
  }

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700"
      title="فتح الملف"
    >
      <FileText size={15} />
      {fileName || "ملف"}
    </a>
  );
}

export default RecordFileLink;
