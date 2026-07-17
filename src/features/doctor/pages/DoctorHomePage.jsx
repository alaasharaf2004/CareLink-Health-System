import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileHeart,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";

import {
  AppointmentStatusBadge,
  AppointmentTypeBadge,
} from "../../patient/components/AppointmentBadges";
import FadeUp from "../../patient/components/FadeUp";
import ProfileAvatar from "../../patient/components/ProfileAvatar";
import { formatArabicDateTime } from "../../patient/utils/formatDateTime";
import { staggerDelay } from "../../patient/utils/staggerDelay";
import DoctorWelcomeHero from "../components/DoctorWelcomeHero";
import { MOCK_DOCTOR_APPOINTMENTS } from "../data/doctorMockData";

const QUICK_ACTIONS = [
  {
    to: "/doctor/appointments",
    icon: CalendarDays,
    label: "المواعيد",
    desc: "قبول ورفض الطلبات",
    gradient: "from-blue-600/10 via-blue-50 to-white",
    iconClass: "bg-gradient-to-br from-blue-600 to-blue-700 text-white",
  },
  {
    to: "/doctor/patients",
    icon: Users,
    label: "المرضى",
    desc: "الملفات الطبية",
    gradient: "from-[#40c0a0]/15 via-emerald-50 to-white",
    iconClass: "bg-gradient-to-br from-[#40c0a0] to-emerald-600 text-white",
  },
  {
    to: "/doctor/medical-records",
    icon: FileHeart,
    label: "السجلات",
    desc: "التقارير الطبية",
    gradient: "from-violet-600/10 via-violet-50 to-white",
    iconClass: "bg-gradient-to-br from-violet-600 to-violet-700 text-white",
  },
  {
    to: "/doctor/appointments",
    icon: Stethoscope,
    label: "المعلقة",
    desc: "بانتظار قرارك",
    gradient: "from-[#101860]/10 via-slate-50 to-white",
    iconClass: "bg-gradient-to-br from-[#101860] to-blue-800 text-white",
  },
];

const STATS = [
  { key: "pending", icon: Clock, label: "معلقة", tone: "text-amber-600 bg-amber-50" },
  { key: "confirmed", icon: CheckCircle2, label: "مؤكدة", tone: "text-blue-600 bg-blue-50" },
  { key: "today", icon: CalendarDays, label: "اليوم", tone: "text-[#40c0a0] bg-emerald-50" },
  { key: "total", icon: CalendarClock, label: "الإجمالي", tone: "text-violet-600 bg-violet-50" },
];

function DoctorHomePage() {
  const appointments = MOCK_DOCTOR_APPOINTMENTS;
  const pending = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const today = appointments.filter((a) =>
    a.scheduled_at.startsWith("2026-07-08")
  );
  const nextAppointment = [...appointments]
    .filter((a) => a.status === "pending" || a.status === "confirmed")
    .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))[0];

  const statValues = {
    pending: pending.length,
    confirmed: confirmed.length,
    today: today.length,
    total: appointments.length,
  };

  return (
    <div className="space-y-8">
      <div className="opacity-0 animate-[formFadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        <DoctorWelcomeHero />
      </div>

      <section>
        <FadeUp index={1}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#101860]">
              إجراءات سريعة
            </h3>
            <span className="text-xs font-medium text-slate-400">وصول مباشر</span>
          </div>
        </FadeUp>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {QUICK_ACTIONS.map(
            ({ to, icon: Icon, label, desc, gradient, iconClass }, index) => (
              <Link
                key={label}
                to={to}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br ${gradient} p-5 shadow-sm opacity-0 transition-all duration-300 animate-[formFadeUp_0.5s_ease_forwards] hover:-translate-y-1 hover:border-[#40c0a0]/30 hover:shadow-lg`}
                style={{ animationDelay: staggerDelay(index, 0.07, 0.1) }}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-110 ${iconClass}`}
                >
                  <Icon size={22} />
                </div>
                <p className="font-extrabold text-[#101860]">{label}</p>
                <p className="mt-1 text-xs text-slate-500">{desc}</p>
                <ArrowLeft
                  size={16}
                  className="absolute bottom-5 left-5 text-slate-300 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#40c0a0]"
                />
              </Link>
            )
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {nextAppointment && (
          <FadeUp index={2} className="lg:col-span-7">
            <div className="patient-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-l from-blue-50/80 to-white px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  الموعد القادم
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <ProfileAvatar
                    src={nextAppointment.patient_avatar}
                    name={nextAppointment.patient_name}
                    size="xl"
                    ring
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-extrabold text-[#101860]">
                      {nextAppointment.patient_name}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500" dir="ltr">
                      {nextAppointment.patient_phone}
                    </p>
                    <p className="mt-3 text-sm font-bold text-slate-700">
                      {formatArabicDateTime(nextAppointment.scheduled_at)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <AppointmentStatusBadge status={nextAppointment.status} />
                      <AppointmentTypeBadge type={nextAppointment.type} />
                      {nextAppointment.type === "online" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-600 ring-1 ring-violet-100">
                          <Video size={12} />
                          عن بُعد
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/doctor/appointments/${nextAppointment.id}`}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#101860] py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-900"
                >
                  عرض تفاصيل الموعد
                  <ArrowLeft size={16} />
                </Link>
              </div>
            </div>
          </FadeUp>
        )}

        <FadeUp
          index={3}
          className={nextAppointment ? "lg:col-span-5" : "lg:col-span-12"}
        >
          <div className="patient-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-extrabold text-[#101860]">
              ملخص المواعيد
            </p>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(({ key, icon: Icon, label, tone }) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-100 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-sm"
                >
                  <div
                    className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}
                  >
                    <Icon size={18} />
                  </div>
                  <p className="text-2xl font-extrabold text-[#101860]">
                    {statValues[key]}
                  </p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp index={4} className="lg:col-span-12">
          <div className="patient-card rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-extrabold text-[#101860]">المواعيد المعلقة</h3>
              <Link
                to="/doctor/appointments"
                className="text-sm font-bold text-[#40c0a0] hover:text-[#2a9d82]"
              >
                عرض الكل
              </Link>
            </div>

            {pending.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-slate-400">
                لا توجد مواعيد معلقة حالياً
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {pending.map((appointment, index) => (
                  <Link
                    key={appointment.id}
                    to={`/doctor/appointments/${appointment.id}`}
                    className="flex items-center gap-4 px-6 py-4 opacity-0 transition-colors animate-[patientSlideIn_0.45s_ease_forwards] hover:bg-slate-50/80"
                    style={{
                      animationDelay: staggerDelay(index, 0.06, 0.35),
                    }}
                  >
                    <ProfileAvatar
                      src={appointment.patient_avatar}
                      name={appointment.patient_name}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[#101860]">
                        {appointment.patient_name}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {formatArabicDateTime(appointment.scheduled_at)}
                      </p>
                    </div>
                    <AppointmentTypeBadge type={appointment.type} />
                    <AppointmentStatusBadge status={appointment.status} />
                    <ArrowLeft size={16} className="shrink-0 text-slate-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </FadeUp>
      </section>
    </div>
  );
}

export default DoctorHomePage;
