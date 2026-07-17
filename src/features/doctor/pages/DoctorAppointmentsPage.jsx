import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Eye, MessageSquare, XCircle } from "lucide-react";

import AdminTable, {
  AdminTableCell,
  AdminTableRow,
} from "../../admin/components/AdminTable";
import Modal from "../../admin/components/Modal";
import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import {
  AppointmentStatusBadge,
  AppointmentTypeBadge,
} from "../../patient/components/AppointmentBadges";
import FadeUp from "../../patient/components/FadeUp";
import ProfileAvatar from "../../patient/components/ProfileAvatar";
import { formatArabicDateTime } from "../../patient/utils/formatDateTime";
import { staggerDelay } from "../../patient/utils/staggerDelay";
import DoctorPageHeader from "../components/DoctorPageHeader";

const COLUMNS = [
  { key: "patient", label: "المريض" },
  { key: "date", label: "الموعد" },
  { key: "duration", label: "المدة" },
  { key: "type", label: "النوع" },
  { key: "status", label: "الحالة" },
  { key: "description", label: "الوصف" },
  { key: "actions", label: "إجراءات", className: "w-40" },
];

const FILTER_TABS = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "معلقة" },
  { key: "confirmed", label: "مؤكدة" },
  { key: "complete", label: "مكتملة" },
  { key: "cancelled", label: "ملغاة" },
];

function PatientMiniCard({ appointment }) {
  return (
    <div className="mb-5 flex items-center gap-4 rounded-2xl border border-slate-100 bg-gradient-to-l from-slate-50 to-white p-4 shadow-sm">
      <ProfileAvatar
        src={appointment.patient_avatar}
        name={appointment.patient_name}
        size="lg"
        ring
      />
      <div className="min-w-0 flex-1">
        <p className="font-extrabold text-blue-950">{appointment.patient_name}</p>
        <p className="text-xs text-slate-500" dir="ltr">
          {appointment.patient_phone}
        </p>
        <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
          الموعد: {formatArabicDateTime(appointment.scheduled_at)}
        </p>
      </div>
    </div>
  );
}

function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [messageTarget, setMessageTarget] = useState(null);
  const [messageText, setMessageText] = useState("");
  const { toast, showToast, hideToast } = useToast();

  const filteredAppointments =
    activeFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === activeFilter);

  const resetMessage = () => setMessageText("");

  const handleAccept = () => {
    if (!messageText.trim()) {
      showToast("اكتب رسالة القبول للمريض", "error");
      return;
    }
    setAppointments((current) =>
      current.map((item) =>
        item.id === acceptTarget.id
          ? {
              ...item,
              status: "confirmed",
              doctor_message: messageText.trim(),
              rejection_reason: "",
            }
          : item
      )
    );
    showToast("تم قبول الموعد وإرسال الرسالة", "success");
    setAcceptTarget(null);
    resetMessage();
  };

  const handleReject = () => {
    if (!messageText.trim()) {
      showToast("اكتب سبب الرفض للمريض", "error");
      return;
    }
    setAppointments((current) =>
      current.map((item) =>
        item.id === rejectTarget.id
          ? {
              ...item,
              status: "cancelled",
              rejection_reason: messageText.trim(),
              doctor_message: messageText.trim(),
            }
          : item
      )
    );
    showToast("تم رفض الموعد", "error");
    setRejectTarget(null);
    resetMessage();
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      showToast("اكتب الرسالة أولاً", "error");
      return;
    }
    setAppointments((current) =>
      current.map((item) =>
        item.id === messageTarget.id
          ? { ...item, doctor_message: messageText.trim() }
          : item
      )
    );
    showToast("تم إرسال الرسالة للمريض", "success");
    setMessageTarget(null);
    resetMessage();
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />

      <DoctorPageHeader
        title="المواعيد"
        description="إدارة مواعيد المرضى — قبول، رفض، أو إرسال رسالة مع كل إجراء."
      />

      <FadeUp index={1}>
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab, index) => {
            const count =
              tab.key === "all"
                ? appointments.length
                : appointments.filter((a) => a.status === tab.key).length;
            const isActive = activeFilter === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "scale-105 bg-blue-600 text-white shadow-md shadow-blue-200/50"
                    : "border border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-sm"
                }`}
                style={{ animationDelay: staggerDelay(index, 0.04, 0.1) }}
              >
                {tab.label}
                <span className="me-1.5 opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </FadeUp>

      {filteredAppointments.length === 0 ? (
        <FadeUp index={2}>
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-400">
              لا توجد مواعيد في هذا التصنيف
            </p>
          </div>
        </FadeUp>
      ) : (
        <FadeUp index={2}>
          <AdminTable columns={COLUMNS}>
            {filteredAppointments.map((appointment, index) => (
              <AdminTableRow
                key={appointment.id}
                className="opacity-0 animate-[formFadeUp_0.45s_ease_forwards]"
                style={{ animationDelay: staggerDelay(index, 0.04, 0.14) }}
              >
                <AdminTableCell>
                  <Link
                    to={`/doctor/appointments/${appointment.id}`}
                    className="flex items-center gap-3 transition-opacity hover:opacity-80"
                  >
                    <ProfileAvatar
                      src={appointment.patient_avatar}
                      name={appointment.patient_name}
                      size="md"
                    />
                    <div>
                      <p className="font-bold text-blue-950">
                        {appointment.patient_name}
                      </p>
                      <p className="text-xs text-slate-400" dir="ltr">
                        {appointment.patient_phone}
                      </p>
                    </div>
                  </Link>
                </AdminTableCell>
                <AdminTableCell>
                  <Link
                    to={`/doctor/appointments/${appointment.id}`}
                    className="text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
                    dir="rtl"
                  >
                    {formatArabicDateTime(appointment.scheduled_at)}
                  </Link>
                </AdminTableCell>
                <AdminTableCell>{appointment.duration_minutes} د</AdminTableCell>
                <AdminTableCell>
                  <AppointmentTypeBadge type={appointment.type} />
                </AdminTableCell>
                <AdminTableCell>
                  <AppointmentStatusBadge status={appointment.status} />
                </AdminTableCell>
                <AdminTableCell>
                  <p className="max-w-[180px] truncate text-slate-600">
                    {appointment.description}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex gap-1">
                    <Link
                      to={`/doctor/appointments/${appointment.id}`}
                      className="rounded-lg p-2 text-slate-500 transition-all duration-200 hover:scale-110 hover:bg-blue-50 hover:text-blue-700"
                      title="التفاصيل"
                    >
                      <Eye size={17} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMessageTarget(appointment);
                        setMessageText(appointment.doctor_message || "");
                      }}
                      className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-700"
                      title="إرسال رسالة"
                    >
                      <MessageSquare size={17} />
                    </button>
                    {appointment.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setAcceptTarget(appointment);
                            setMessageText("");
                          }}
                          className="cursor-pointer rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                          title="قبول"
                        >
                          <CheckCircle2 size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectTarget(appointment);
                            setMessageText("");
                          }}
                          className="cursor-pointer rounded-lg p-2 text-red-500 hover:bg-red-50"
                          title="رفض"
                        >
                          <XCircle size={17} />
                        </button>
                      </>
                    )}
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTable>
        </FadeUp>
      )}

      {acceptTarget && (
        <Modal title="قبول الموعد" onClose={() => { setAcceptTarget(null); resetMessage(); }}>
          <PatientMiniCard appointment={acceptTarget} />
          <label className="mb-2 block text-sm font-bold text-slate-700">
            رسالة القبول للمريض
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={4}
            className="mb-4 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            placeholder="مثال: تم تأكيد الموعد، يُرجى الالتزام بالوقت..."
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setAcceptTarget(null); resetMessage(); }}
              className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              تراجع
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 cursor-pointer rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
            >
              تأكيد القبول
            </button>
          </div>
        </Modal>
      )}

      {rejectTarget && (
        <Modal title="رفض الموعد" onClose={() => { setRejectTarget(null); resetMessage(); }}>
          <PatientMiniCard appointment={rejectTarget} />
          <label className="mb-2 block text-sm font-bold text-slate-700">
            سبب الرفض / الرسالة للمريض
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={4}
            className="mb-4 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            placeholder="مثال: تعارض مع موعد آخر في نفس الوقت..."
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setRejectTarget(null); resetMessage(); }}
              className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              تراجع
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              تأكيد الرفض
            </button>
          </div>
        </Modal>
      )}

      {messageTarget && (
        <Modal title="إرسال رسالة" onClose={() => { setMessageTarget(null); resetMessage(); }}>
          <PatientMiniCard appointment={messageTarget} />
          <label className="mb-2 block text-sm font-bold text-slate-700">
            الرسالة للمريض
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={4}
            className="mb-4 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            placeholder="اكتب رسالتك هنا..."
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setMessageTarget(null); resetMessage(); }}
              className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSendMessage}
              className="flex-1 cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              إرسال
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DoctorAppointmentsPage;
