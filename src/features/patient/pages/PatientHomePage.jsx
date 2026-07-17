import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileHeart,
  Pill,
  Stethoscope,
  Video,
} from "lucide-react";

import { AppointmentStatusBadge } from "../components/AppointmentBadges";
import PatientWelcomeHero from "../components/PatientWelcomeHero";
import ProfileAvatar from "../components/ProfileAvatar";
import { formatArabicDateTime } from "../utils/formatDateTime";

const QUICK_ACTIONS = [
  {
    to: "/patient/appointments",
    icon: CalendarDays,
    label: "حجز موعد",
    desc: "مع طبيب مختص",
    gradient: "from-blue-600/10 via-blue-50 to-white",
    iconClass: "bg-gradient-to-br from-blue-600 to-blue-700 text-white",
  },
  {
    to: "/patient/medical-profile",
    icon: FileHeart,
    label: "الملف الطبي",
    desc: "تحديث بياناتك",
    gradient: "from-[#40c0a0]/15 via-emerald-50 to-white",
    iconClass: "bg-gradient-to-br from-[#40c0a0] to-emerald-600 text-white",
  },
  {
    to: "/patient/medical-records",
    icon: Pill,
    label: "السجلات",
    desc: "تقاريرك الطبية",
    gradient: "from-violet-600/10 via-violet-50 to-white",
    iconClass: "bg-gradient-to-br from-violet-600 to-violet-700 text-white",
  },
  {
    to: "/patient/appointments",
    icon: Stethoscope,
    label: "مواعيدي",
    desc: "إدارة المواعيد",
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

function PatientHomePage() {
  const myAppointments = [];
  const pending = myAppointments.filter((a) => a.status === "pending");
  const confirmed = myAppointments.filter((a) => a.status === "confirmed");
  const today = myAppointments.filter((a) =>
    a.scheduled_at?.startsWith(new Date().toISOString().slice(0, 10))
  );
  const nextAppointment = [...myAppointments]
    .filter((a) => a.status === "pending" || a.status === "confirmed")
    .sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))[0];

  const statValues = {
    pending: pending.length,
    confirmed: confirmed.length,
    today: today.length,
    total: myAppointments.length,
  };

  return (
    <div className="space-y-8">
      <div className="opacity-0 animate-[formFadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        <PatientWelcomeHero />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#101860]">إجراءات سريعة</h3>
          <span className="text-xs font-medium text-slate-400">وصول مباشر</span>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {QUICK_ACTIONS.map(
            ({ to, icon: Icon, label, desc, gradient, iconClass }, index) => (
              <Link
                key={label}
                to={to}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br ${gradient} p-5 shadow-sm opacity-0 transition-all duration-300 animate-[formFadeUp_0.5s_ease_forwards] hover:-translate-y-1 hover:border-[#40c0a0]/30 hover:shadow-lg`}
                style={{ animationDelay: `${0.1 + index * 0.07}s` }}
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
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-7">
            <div className="border-b border-slate-100 bg-gradient-to-l from-blue-50/80 to-white px-6 py-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                الموعد القادم
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <ProfileAvatar
                  src={nextAppointment.doctor_avatar}
                  name={nextAppointment.doctor_name}
                  size="xl"
                  ring
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-extrabold text-[#101860]">
                    {nextAppointment.doctor_name}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {nextAppointment.doctor_specialty}
                  </p>
                  <p className="mt-3 text-sm font-bold text-slate-700">
                    {formatArabicDateTime(nextAppointment.scheduled_at)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <AppointmentStatusBadge status={nextAppointment.status} />
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
                to={`/patient/appointments/${nextAppointment.id}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#101860] py-3 text-sm font-bold text-white transition-colors hover:bg-blue-900"
              >
                عرض تفاصيل الموعد
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>
        )}

        <div
          className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${nextAppointment ? "lg:col-span-5" : "lg:col-span-12"}`}
        >
          <p className="mb-4 text-sm font-extrabold text-[#101860]">ملخص المواعيد</p>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ key, icon: Icon, label, tone }) => (
              <div
                key={key}
                className="rounded-xl border border-slate-100 p-4 transition-colors hover:border-slate-200"
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

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-12">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="font-extrabold text-[#101860]">المواعيد المعلقة</h3>
            <Link
              to="/patient/appointments"
              className="text-sm font-bold text-[#40c0a0] hover:text-[#2a9d82]"
            >
              عرض الكل
            </Link>
          </div>

          {pending.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate-400">
              لا توجد مواعيد معلقة — أنت منظم!
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {pending.map((appointment) => (
                <Link
                  key={appointment.id}
                  to={`/patient/appointments/${appointment.id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/80"
                >
                  <ProfileAvatar
                    src={appointment.doctor_avatar}
                    name={appointment.doctor_name}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#101860]">
                      {appointment.doctor_name}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {formatArabicDateTime(appointment.scheduled_at)}
                    </p>
                  </div>
                  <AppointmentStatusBadge status={appointment.status} />
                  <ArrowLeft size={16} className="shrink-0 text-slate-300" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PatientHomePage;
