import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  Phone,
  User,
  Video,
} from "lucide-react";

import {
  AppointmentStatusBadge,
  AppointmentTypeBadge,
} from "../../patient/components/AppointmentBadges";
import FadeUp from "../../patient/components/FadeUp";
import ProfileAvatar from "../../patient/components/ProfileAvatar";
import { APPOINTMENT_TYPE_LABELS } from "../../patient/constants/appointmentLabels";
import { formatArabicDateTime } from "../../patient/utils/formatDateTime";
import {
  getAppointmentById,
  getPatientById,
  MOCK_DOCTOR_PROFILE,
} from "../data/doctorMockData";

function InfoItem({ icon: Icon, label, value, dir }) {
  return (
    <div className="patient-card flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-bold text-blue-950" dir={dir}>
          {value}
        </p>
      </div>
    </div>
  );
}

function DoctorAppointmentDetailPage() {
  const { id } = useParams();
  const appointment = getAppointmentById(id);
  const patient = appointment ? getPatientById(appointment.patient_id) : null;

  if (!appointment) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="font-bold text-slate-600">الموعد غير موجود</p>
        <Link
          to="/doctor/appointments"
          className="mt-4 inline-block text-sm font-bold text-blue-600"
        >
          العودة للمواعيد
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeUp index={0}>
        <Link
          to="/doctor/appointments"
          className="inline-flex items-center gap-2 rounded-xl border border-transparent px-2 py-1 text-sm font-bold text-blue-600 transition-all duration-200 hover:-translate-x-1 hover:border-blue-100 hover:bg-blue-50"
        >
          <ArrowRight size={16} />
          العودة للمواعيد
        </Link>
      </FadeUp>

      <FadeUp index={1}>
        <div className="patient-card overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="relative flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-l from-blue-50/50 via-white to-white p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <ProfileAvatar
                src={appointment.patient_avatar}
                name={appointment.patient_name}
                size="xl"
                ring
                animate
              />
              <div>
                <h1 className="text-2xl font-extrabold text-blue-950">
                  {appointment.patient_name}
                </h1>
                <p className="text-sm text-slate-500" dir="ltr">
                  {appointment.patient_phone}
                </p>
                {patient && (
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    رقم المريض: {patient.id} · {patient.age} سنة
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <AppointmentStatusBadge status={appointment.status} />
              <AppointmentTypeBadge type={appointment.type} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-6 py-3">
            <ProfileAvatar
              src={MOCK_DOCTOR_PROFILE.profile_picture}
              name={MOCK_DOCTOR_PROFILE.name}
              size="sm"
            />
            <p className="text-sm text-slate-600">
              الطبيب:{" "}
              <span className="font-bold text-blue-950">
                {MOCK_DOCTOR_PROFILE.name}
              </span>
            </p>
            <span className="text-slate-300">|</span>
            <p className="text-sm text-slate-600" dir="rtl">
              {formatArabicDateTime(appointment.scheduled_at)}
            </p>
          </div>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <FadeUp index={2}>
            <div className="patient-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-extrabold text-blue-950">
                معلومات الموعد
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={User}
                  label="المريض"
                  value={appointment.patient_name}
                />
                <InfoItem
                  icon={Phone}
                  label="هاتف المريض"
                  value={appointment.patient_phone}
                  dir="ltr"
                />
                <InfoItem
                  icon={Calendar}
                  label="الموعد"
                  value={formatArabicDateTime(appointment.scheduled_at)}
                />
                <InfoItem
                  icon={Clock}
                  label="المدة"
                  value={`${appointment.duration_minutes} دقيقة`}
                />
              </div>

              <div className="mt-4 rounded-xl bg-blue-50/50 p-4">
                <p className="mb-1 text-xs font-bold text-slate-500">الوصف</p>
                <p className="text-sm leading-7 text-slate-700">
                  {appointment.description}
                </p>
              </div>

              {appointment.doctor_message && (
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                  <p className="mb-1 text-xs font-bold text-blue-600">
                    رسالة الطبيب
                  </p>
                  <p className="text-sm text-blue-900">
                    {appointment.doctor_message}
                  </p>
                </div>
              )}

              {appointment.rejection_reason && (
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="mb-1 text-xs font-bold text-red-600">
                    سبب الرفض / الإلغاء
                  </p>
                  <p className="text-sm text-red-700">
                    {appointment.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          </FadeUp>
        </div>

        <div className="space-y-4">
          <FadeUp index={3}>
            <div className="patient-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-extrabold text-blue-950">الرسوم</h2>
              <p className="text-3xl font-extrabold text-emerald-600">
                {appointment.fee_label}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {appointment.fee === 0
                  ? "لا توجد رسوم على هذا الموعد"
                  : `${appointment.fee} ₪`}
              </p>
            </div>
          </FadeUp>

          {appointment.type === "online" && appointment.zoom_link && (
            <FadeUp index={4}>
              <div className="patient-card rounded-2xl border border-violet-200 bg-gradient-to-l from-violet-50/80 to-white p-6">
                <div className="mb-3 flex items-center gap-2 text-violet-700">
                  <Video size={20} />
                  <h2 className="text-lg font-extrabold">رابط اللقاء</h2>
                </div>
                <p className="mb-4 text-sm text-slate-600">
                  نوع الموعد: {APPOINTMENT_TYPE_LABELS.online}
                </p>
                <a
                  href={appointment.zoom_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-700"
                >
                  <ExternalLink size={16} />
                  انضم عبر Zoom
                </a>
              </div>
            </FadeUp>
          )}

          <FadeUp index={5}>
            <div className="patient-card rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-extrabold text-blue-950">
                بيانات الطبيب
              </h2>
              <div className="flex items-center gap-3">
                <ProfileAvatar
                  src={MOCK_DOCTOR_PROFILE.profile_picture}
                  name={MOCK_DOCTOR_PROFILE.name}
                  size="lg"
                />
                <div>
                  <p className="font-bold text-blue-950">
                    {MOCK_DOCTOR_PROFILE.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {MOCK_DOCTOR_PROFILE.specialty}
                  </p>
                  <p className="mt-1 text-sm text-slate-600" dir="ltr">
                    <Phone size={14} className="me-1 inline" />
                    {MOCK_DOCTOR_PROFILE.phone}
                  </p>
                </div>
              </div>
              {patient && (
                <Link
                  to={`/doctor/patients/${patient.id}`}
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  عرض الملف الطبي للمريض
                </Link>
              )}
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointmentDetailPage;
