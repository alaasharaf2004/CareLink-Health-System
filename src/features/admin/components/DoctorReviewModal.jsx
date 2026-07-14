import {
  Briefcase,
  Calendar,
  Check,
  FileText,
  IdCard,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone,
  Stethoscope,
  X,
} from "lucide-react";

import Modal from "./Modal";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate text-sm font-bold text-blue-950" dir="auto">
          {value}
        </p>
      </div>
    </div>
  );
}

function DoctorReviewModal({ doctor, onApprove, onReject, onClose }) {
  if (!doctor) return null;

  const isImage = doctor.credential_document?.type === "image";
  const DocIcon = isImage ? ImageIcon : FileText;

  return (
    <Modal title="مراجعة طلب الطبيب" onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-xl font-extrabold text-blue-700">
            {doctor.name.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-extrabold text-blue-950" dir="auto">
              {doctor.name}
            </p>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-600">
              بانتظار المراجعة
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow icon={Stethoscope} label="التخصص" value={doctor.specialty} />
          <InfoRow
            icon={Briefcase}
            label="سنوات الخبرة"
            value={`${doctor.years_of_experience} سنوات`}
          />
          <InfoRow icon={Mail} label="البريد الإلكتروني" value={doctor.email} />
          <InfoRow icon={Phone} label="الهاتف" value={doctor.phone} />
          <InfoRow icon={IdCard} label="رقم الهوية" value={doctor.national_id} />
          <InfoRow
            icon={Calendar}
            label="تاريخ الميلاد"
            value={doctor.date_of_birth}
          />
          <InfoRow icon={MapPin} label="العنوان" value={doctor.address} />
          <InfoRow
            icon={Calendar}
            label="تاريخ التقديم"
            value={doctor.submitted_at}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-slate-600">
            وثيقة الاعتماد (الشهادة / الترخيص)
          </p>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <DocIcon size={18} />
              </div>
              <span className="truncate text-sm font-bold text-blue-950" dir="ltr">
                {doctor.credential_document?.name || "لا يوجد ملف"}
              </span>
            </div>
            <a
              href={doctor.credential_document?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
            >
              فتح الملف
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={() => onApprove(doctor)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
          >
            <Check size={18} />
            قبول الطبيب وإرسال رسالة القبول
          </button>
          <button
            type="button"
            onClick={() => onReject(doctor)}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 sm:flex-none sm:px-6"
          >
            <X size={18} />
            رفض
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DoctorReviewModal;
