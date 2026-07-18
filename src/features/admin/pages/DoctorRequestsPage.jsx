import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- إضافة الـ Hook الخاص بالتوجيه
import {
  Ban,
  Check,
  Eye,
  Mail,
  RotateCcw,
  UserCheck,
  X,
  Plus, // <-- إضافة أيقونة الزائد
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
 import apiClient from "../../../lib/api/client"; 

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
  const navigate = useNavigate(); // <-- تهيئة التوجيه
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [reviewingDoctor, setReviewingDoctor] = useState(null);
  const [emailDoctor, setEmailDoctor] = useState(null);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get("/admin/doctors"); 
        
        const formattedDoctors = response.data.data.map(doc => ({
          id: doc.id,
          name: doc.name,
          email: doc.email,
          phone: doc.phone,
          specialty: doc.doctor_profile?.specialty || "غير محدد",
          status: doc.doctor_profile?.status || "pending",
          fullProfile: doc.doctor_profile 
        }));

        setDoctors(formattedDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        showToast("حدث خطأ أثناء جلب بيانات الأطباء", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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

  const handleApprove = async (doctor) => {
    try {
      await apiClient.put(`/admin/doctors/${doctor.id}/status`, { status: 'active' });
      updateStatus(doctor.id, "active");
      setReviewingDoctor(null);
      showToast(`تم تفعيل د. ${doctor.name} وإرسال رسالة القبول`, "success");
    } catch (error) {
      showToast(error.response?.data?.message || "حدث خطأ أثناء التفعيل", "error");
    }
  };

  const handleReject = async (doctor) => {
    try {
      await apiClient.delete(`/admin/doctors/${doctor.id}`);
      setDoctors((current) => current.filter((d) => d.id !== doctor.id));
      setReviewingDoctor(null);
      showToast(`تم رفض طلب د. ${doctor.name}`, "error");
    } catch (error) {
      showToast(error.response?.data?.message || "حدث خطأ أثناء الرفض", "error");
    }
  };

  const handleSuspend = async (doctor) => {
    try {
      await apiClient.put(`/admin/doctors/${doctor.id}/status`, { status: 'suspended' });
      updateStatus(doctor.id, "suspended");
      showToast(`تم إيقاف حساب د. ${doctor.name}`, "info");
    } catch (error) {
      showToast("حدث خطأ أثناء الإيقاف", "error");
    }
  };

  const handleReactivate = async (doctor) => {
    try {
      await apiClient.put(`/admin/doctors/${doctor.id}/status`, { status: 'active' });
      updateStatus(doctor.id, "active");
      showToast(`تم إعادة تفعيل د. ${doctor.name}`, "success");
    } catch (error) {
      showToast("حدث خطأ أثناء التفعيل", "error");
    }
  };

  const handleSendEmail = async (emailData) => {
    try {
      await apiClient.post(`/admin/doctors/${emailDoctor.id}/email`, emailData);
      showToast(`تم إرسال البريد إلى ${emailDoctor.email} بنجاح`, "success");
      setEmailDoctor(null);
    } catch (error) {
      showToast("حدث خطأ أثناء إرسال البريد", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg font-bold text-slate-500">جاري تحميل بيانات الأطباء...</div>
      </div>
    );
  }

  return (
    <div>
      <Toast toast={toast} onClose={hideToast} />

      {/* التعديل الجوهري هنا في الهيدر */}
      <AdminPageHeader
        title="الأطباء"
        description="راجع طلبات التسجيل، تحقق من الوثائق، وفعّل أو أوقف حسابات الأطباء."
        action={
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-600">
                {pendingCount} بانتظار التفعيل
              </span>
            )}
            
            {/* زر إضافة طبيب جديد */}
            <button
              type="button"
              onClick={() => navigate('/admin/doctors/new')} // تأكد من المسار
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-200/50"
            >
              <Plus size={18} />
              إضافة طبيب
            </button>
          </div>
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
 