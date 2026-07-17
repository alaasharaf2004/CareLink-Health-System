import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarPlus,
  CalendarSync,
  Eye,
  Plus,
  Star,
  XCircle,
} from "lucide-react";

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
} from "../components/AppointmentBadges";
import DateTimePicker from "../components/DateTimePicker";
import FadeUp from "../components/FadeUp";
import PatientPageHeader from "../components/PatientPageHeader";
import ProfileAvatar from "../components/ProfileAvatar";
import {
  formatArabicDateTime,
  QUICK_TIME_SLOTS,
  todayIsoDate,
} from "../utils/formatDateTime";
import { staggerDelay } from "../utils/staggerDelay";

const AVAILABLE_DOCTORS = [];

const COLUMNS = [
  { key: "doctor", label: "الطبيب" },
  { key: "date", label: "الموعد" },
  { key: "duration", label: "المدة" },
  { key: "type", label: "النوع" },
  { key: "status", label: "الحالة" },
  { key: "description", label: "الوصف" },
  { key: "reject", label: "سبب الرفض" },
  { key: "actions", label: "إجراءات", className: "w-28" },
];

const FILTER_TABS = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "معلقة" },
  { key: "confirmed", label: "مؤكدة" },
  { key: "complete", label: "مكتملة" },
  { key: "cancelled", label: "ملغاة" },
];

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-blue-950 outline-none focus:border-blue-500";

function DoctorMiniCard({ doctorName, avatar, specialty, scheduledAt }) {
  return (
    <div className="mb-5 flex items-center gap-4 rounded-2xl border border-slate-100 bg-gradient-to-l from-slate-50 to-white p-4 shadow-sm">
      <ProfileAvatar src={avatar} name={doctorName} size="lg" ring />
      <div className="min-w-0 flex-1">
        <p className="font-extrabold text-blue-950">{doctorName}</p>
        <p className="text-xs text-slate-500">{specialty}</p>
        {scheduledAt && (
          <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
            الموعد الحالي: {formatArabicDateTime(scheduledAt)}
          </p>
        )}
      </div>
    </div>
  );
}

function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleNote, setRescheduleNote] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    doctor: "",
    datetime: "",
    type: "online",
    description: "",
  });
  const { toast, showToast, hideToast } = useToast();

  const filteredAppointments =
    activeFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === activeFilter);

  const openReschedule = (appointment) => {
    setRescheduleTarget(appointment);
    setRescheduleDate("");
    setRescheduleNote("");
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      showToast("يرجى كتابة سبب الإلغاء", "error");
      return;
    }
    setAppointments((current) =>
      current.map((item) =>
        item.id === cancelTarget.id
          ? {
              ...item,
              status: "cancelled",
              rejection_reason: cancelReason.trim(),
            }
          : item
      )
    );
    showToast("تم إلغاء الموعد", "error");
    setCancelTarget(null);
    setCancelReason("");
  };

  const handleReschedule = () => {
    if (!rescheduleDate.trim()) {
      showToast("اختر التاريخ والوقت الجديد", "error");
      return;
    }
    setAppointments((current) =>
      current.map((item) =>
        item.id === rescheduleTarget.id
          ? {
              ...item,
              scheduled_at: rescheduleDate,
              status: "pending",
              rejection_reason: rescheduleNote.trim(),
            }
          : item
      )
    );
    showToast("تم إرسال طلب التأجيل للطبيب", "success");
    setRescheduleTarget(null);
    setRescheduleDate("");
    setRescheduleNote("");
  };

  const handleAddAppointment = () => {
    if (!newAppointment.doctor) {
      showToast("لا يوجد أطباء متاحون حالياً", "error");
      return;
    }
    if (!newAppointment.datetime.trim()) {
      showToast("اختر تاريخ ووقت الموعد", "error");
      return;
    }
    const doctor = AVAILABLE_DOCTORS.find((d) => d.name === newAppointment.doctor);
    if (!doctor) {
      showToast("اختر طبيباً صالحاً", "error");
      return;
    }
    const nextId = Math.max(...appointments.map((a) => a.id), 0) + 1;

    setAppointments((current) => [
      {
        id: nextId,
        patient_name: "المريض",
        doctor_name: doctor.name,
        doctor_specialty: doctor.specialty,
        doctor_phone: doctor.phone,
        doctor_avatar: doctor.avatar,
        scheduled_at: newAppointment.datetime,
        duration_minutes: 30,
        type: newAppointment.type,
        status: "pending",
        description: newAppointment.description || "موعد جديد",
        rejection_reason: "",
        zoom_link: newAppointment.type === "online" ? "" : "",
        fee: 0,
        fee_label: "مجاني",
      },
      ...current,
    ]);

    showToast("تم حجز الموعد بنجاح", "success");
    setIsAddOpen(false);
    setNewAppointment({
      doctor: AVAILABLE_DOCTORS[0]?.name ?? "",
      datetime: "",
      type: "online",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={hideToast} />

      <PatientPageHeader
        title="المواعيد"
        description="عرض مواعيدك مع الأطباء — إلغاء، طلب تأجيل، أو حجز موعد جديد."
        action={
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
          >
            <Plus size={18} />
            موعد جديد
          </button>
        }
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
                <div className="flex items-center gap-3">
                  <ProfileAvatar
                    src={appointment.doctor_avatar}
                    name={appointment.doctor_name}
                    size="md"
                  />
                  <div>
                    <p className="font-bold text-blue-950">
                      {appointment.doctor_name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {appointment.doctor_specialty}
                    </p>
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <p className="text-sm font-medium text-slate-700" dir="rtl">
                  {formatArabicDateTime(appointment.scheduled_at)}
                </p>
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
                {appointment.rejection_reason ? (
                  <span className="text-xs text-red-600">
                    {appointment.rejection_reason}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-1">
                  <Link
                    to={`/patient/appointments/${appointment.id}`}
                    className="rounded-lg p-2 text-slate-500 transition-all duration-200 hover:scale-110 hover:bg-blue-50 hover:text-blue-700"
                    title="التفاصيل"
                  >
                    <Eye size={17} />
                  </Link>
                  {appointment.status !== "cancelled" &&
                    appointment.status !== "complete" && (
                      <>
                        <button
                          type="button"
                          onClick={() => openReschedule(appointment)}
                          className="cursor-pointer rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                          title="طلب تأجيل"
                        >
                          <CalendarSync size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelTarget(appointment)}
                          className="cursor-pointer rounded-lg p-2 text-red-500 hover:bg-red-50"
                          title="إلغاء"
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

      {cancelTarget && (
        <Modal title="إلغاء الموعد" onClose={() => setCancelTarget(null)}>
          <DoctorMiniCard
            doctorName={cancelTarget.doctor_name}
            avatar={cancelTarget.doctor_avatar}
            specialty={cancelTarget.doctor_specialty}
            scheduledAt={cancelTarget.scheduled_at}
          />
          <label className="mb-2 block text-sm font-bold text-slate-700">
            سبب الإلغاء / الرسالة للطبيب
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={4}
            className="mb-4 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            placeholder="مثال: ظرف طارئ يمنعني من الحضور..."
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCancelTarget(null)}
              className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              تراجع
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 cursor-pointer rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              تأكيد الإلغاء
            </button>
          </div>
        </Modal>
      )}

      {rescheduleTarget && (
        <Modal
          title="طلب تأجيل الموعد"
          onClose={() => setRescheduleTarget(null)}
          maxWidth="max-w-xl"
        >
          <DoctorMiniCard
            doctorName={rescheduleTarget.doctor_name}
            avatar={rescheduleTarget.doctor_avatar}
            specialty={rescheduleTarget.doctor_specialty}
            scheduledAt={rescheduleTarget.scheduled_at}
          />

          <p className="mb-3 text-sm font-bold text-slate-700">
            الموعد الجديد المقترح
          </p>
          <DateTimePicker
            value={rescheduleDate}
            onChange={setRescheduleDate}
            minDate={todayIsoDate()}
            timeSlots={QUICK_TIME_SLOTS}
          />

          <label className="mb-2 mt-4 block text-sm font-bold text-slate-700">
            ملاحظة للطبيب (اختياري)
          </label>
          <textarea
            value={rescheduleNote}
            onChange={(e) => setRescheduleNote(e.target.value)}
            rows={2}
            className="mb-4 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            placeholder="سبب طلب التأجيل..."
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setRescheduleTarget(null)}
              className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleReschedule}
              className="flex-1 cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              إرسال الطلب
            </button>
          </div>
        </Modal>
      )}

      {isAddOpen && (
        <Modal
          title="حجز موعد جديد"
          onClose={() => setIsAddOpen(false)}
          maxWidth="max-w-2xl"
          backdrop="frost"
          footer={
            <button
              type="button"
              onClick={handleAddAppointment}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#101860] to-blue-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-900/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <CalendarPlus size={18} />
              تأكيد الحجز
            </button>
          }
        >
          <div className="space-y-4">
            <section>
              <p className="mb-2.5 text-sm font-extrabold text-[#101860]">
                اختر الطبيب
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {AVAILABLE_DOCTORS.length === 0 ? (
                  <p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-bold text-slate-500">
                    لا يوجد أطباء متاحون حالياً
                  </p>
                ) : (
                  AVAILABLE_DOCTORS.map((doctor) => {
                  const selected = newAppointment.doctor === doctor.name;
                  return (
                    <button
                      key={doctor.name}
                      type="button"
                      onClick={() =>
                        setNewAppointment((c) => ({ ...c, doctor: doctor.name }))
                      }
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-right transition-all duration-200 ${
                        selected
                          ? "border-blue-500 bg-gradient-to-l from-blue-50 to-white shadow-md shadow-blue-100/70 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
                      }`}
                    >
                      <ProfileAvatar
                        src={doctor.avatar}
                        name={doctor.name}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-[#101860]">
                          {doctor.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doctor.specialty}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Star
                            size={12}
                            className="fill-amber-400 text-amber-400"
                          />
                          {doctor.rating}
                        </div>
                      </div>
                      {selected && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          مختار
                        </span>
                      )}
                    </button>
                  );
                })
                )}
              </div>
            </section>

            <section>
              <p className="mb-2.5 text-sm font-extrabold text-[#101860]">
                التاريخ والوقت
              </p>
              <DateTimePicker
                value={newAppointment.datetime}
                onChange={(datetime) =>
                  setNewAppointment((c) => ({ ...c, datetime }))
                }
                minDate={todayIsoDate()}
                timeSlots={QUICK_TIME_SLOTS}
              />
            </section>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-extrabold text-[#101860]">
                  نوع الموعد
                </label>
                <select
                  className={`${inputClass} rounded-2xl border-slate-200 bg-slate-50/50`}
                  value={newAppointment.type}
                  onChange={(e) =>
                    setNewAppointment((c) => ({ ...c, type: e.target.value }))
                  }
                >
                  <option value="online">عن بُعد</option>
                  <option value="in_person">حضوري</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-extrabold text-[#101860]">
                  وصف مختصر
                </label>
                <input
                  type="text"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="ما سبب الزيارة؟"
                  value={newAppointment.description}
                  onChange={(e) =>
                    setNewAppointment((c) => ({
                      ...c,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </section>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default PatientAppointmentsPage;
