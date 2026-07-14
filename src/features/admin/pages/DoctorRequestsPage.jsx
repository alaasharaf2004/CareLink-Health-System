import { useMemo, useState } from "react";
import {
  Ban,
  Check,
  Eye,
  Mail,
  RotateCcw,
  UserCheck,
  X,
} from "lucide-react";

import AdminPageHeader from "../components/AdminPageHeader";
import AdminTable, {
  AdminTableCell,
  AdminTableRow,
} from "../components/AdminTable";
import DoctorReviewModal from "../components/DoctorReviewModal";
import EmptyState from "../components/EmptyState";
import SendEmailModal from "../components/SendEmailModal";
import StatusBadge from "../components/StatusBadge";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { MOCK_DOCTORS } from "../data/adminMockData";

const FILTER_OPTIONS = [
  { value: "all", label: "الكل" },
  { value: "pending", label: "بانتظار التفعيل" },
  { value: "active", label: "مفعّلون" },
  { value: "suspended", label: "موقوفون" },
];

const DOCTOR_COLUMNS = [
  { key: "name", label: "الاسم" },
  { key: "phone", label: "رقم الهاتف" },
  { key: "specialty", label: "التخصص" },
  { key: "status", label: "الحالة" },
  { key: "actions", label: "الإجراءات", className: "w-56" },
];

function ActionButton({ onClick, label, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`cursor-pointer rounded-lg p-2 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function DoctorRequestsPage() {
  const [doctors, setDoctors] = useState(MOCK_DOCTORS);
  const [filter, setFilter] = useState("all");
  const [reviewingDoctor, setReviewingDoctor] = useState(null);
  const [emailDoctor, setEmailDoctor] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  const filteredDoctors = useMemo(() => {
    if (filter === "all") return doctors;
    return doctors.filter((doctor) => doctor.status === filter);
  }, [doctors, filter]);

  const pendingCount = doctors.filter((d) => d.status === "pending").length;

  const updateStatus = (id, status) =>
    setDoctors((current) =>
      current.map((doctor) =>
        doctor.id === id ? { ...doctor, status } : doctor
      )
    );

  const handleApprove = (doctor) => {
    updateStatus(doctor.id, "active");
    setReviewingDoctor(null);
    showToast(`تم تفعيل د. ${doctor.name} وإرسال رسالة القبول`, "success");
  };

  const handleReject = (doctor) => {
    setDoctors((current) => current.filter((d) => d.id !== doctor.id));
    setReviewingDoctor(null);
    showToast(`تم رفض طلب د. ${doctor.name}`, "error");
  };

  const handleSuspend = (doctor) => {
    updateStatus(doctor.id, "suspended");
    showToast(`تم إيقاف حساب د. ${doctor.name}`, "info");
  };

  const handleReactivate = (doctor) => {
    updateStatus(doctor.id, "active");
    showToast(`تم إعادة تفعيل د. ${doctor.name}`, "success");
  };

  const handleSendEmail = () => {
    showToast(`تم إرسال البريد إلى ${emailDoctor.email}`, "success");
    setEmailDoctor(null);
  };

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />

      <AdminPageHeader
        title="الأطباء"
        description="راجع طلبات التسجيل، تحقق من الوثائق، وفعّل أو أوقف حسابات الأطباء."
        action={
          pendingCount > 0 ? (
            <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600">
              {pendingCount} بانتظار التفعيل
            </span>
          ) : null
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
              filter === value
                ? "bg-blue-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="لا يوجد أطباء في هذا الفلتر"
          description="جرّب فلتراً آخر أو انتظر طلبات جديدة."
        />
      ) : (
        <AdminTable columns={DOCTOR_COLUMNS} emptyMessage="لا يوجد أطباء">
          {filteredDoctors.map((doctor) => (
            <AdminTableRow key={doctor.id}>
              <AdminTableCell>
                <span className="font-bold text-blue-950" dir="auto">
                  {doctor.name}
                </span>
              </AdminTableCell>
              <AdminTableCell dir="ltr">{doctor.phone}</AdminTableCell>
              <AdminTableCell>{doctor.specialty}</AdminTableCell>
              <AdminTableCell>
                <StatusBadge status={doctor.status} />
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex items-center gap-1">
                  <ActionButton
                    onClick={() => setReviewingDoctor(doctor)}
                    label="عرض الوثائق"
                    className="text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Eye size={17} />
                  </ActionButton>

                  {doctor.status === "pending" && (
                    <>
                      <ActionButton
                        onClick={() => handleApprove(doctor)}
                        label="تفعيل"
                        className="text-emerald-600 hover:bg-emerald-50"
                      >
                        <Check size={17} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleReject(doctor)}
                        label="رفض"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X size={17} />
                      </ActionButton>
                    </>
                  )}

                  {doctor.status === "active" && (
                    <ActionButton
                      onClick={() => handleSuspend(doctor)}
                      label="إيقاف"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Ban size={17} />
                    </ActionButton>
                  )}

                  {doctor.status === "suspended" && (
                    <ActionButton
                      onClick={() => handleReactivate(doctor)}
                      label="إعادة تفعيل"
                      className="text-emerald-600 hover:bg-emerald-50"
                    >
                      <RotateCcw size={17} />
                    </ActionButton>
                  )}

                  <ActionButton
                    onClick={() => setEmailDoctor(doctor)}
                    label="إرسال بريد"
                    className="text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Mail size={17} />
                  </ActionButton>
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTable>
      )}

      {reviewingDoctor && (
        <DoctorReviewModal
          doctor={reviewingDoctor}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setReviewingDoctor(null)}
        />
      )}

      {emailDoctor && (
        <SendEmailModal
          doctor={emailDoctor}
          onSend={handleSendEmail}
          onClose={() => setEmailDoctor(null)}
        />
      )}
    </div>
  );
}

export default DoctorRequestsPage;
