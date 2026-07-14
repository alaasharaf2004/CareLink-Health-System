import { Link } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Sparkles } from "lucide-react";

import ProfileAvatar from "./ProfileAvatar";
import { MOCK_MEDICAL_PROFILE, MOCK_PATIENT_PROFILE } from "../data/patientMockData";

function PatientWelcomeHero() {
  return (
    <section className="patient-hero relative overflow-hidden rounded-3xl">
      <div className="patient-hero-bg" aria-hidden="true" />

      <div className="relative grid grid-cols-1 items-center gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#40c0a0]/30 bg-[#40c0a0]/10 px-3 py-1 text-xs font-bold text-[#2a9d82]">
            <Sparkles size={13} />
            رعاية صحية ذكية
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#101860] sm:text-4xl">
            مرحباً بعودتك،{" "}
            <span className="bg-gradient-to-l from-[#40c0a0] to-blue-600 bg-clip-text text-transparent">
              {MOCK_PATIENT_PROFILE.name}
            </span>
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
            تابع مواعيدك، ملفك الطبي، وسجلاتك من مكان واحد — بكل سهولة
            وأمان مع أطباء CareLink.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/patient/appointments"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#101860] to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <CalendarPlus size={17} />
              احجز موعداً الآن
            </Link>
            <Link
              to="/patient/medical-profile"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-bold text-slate-700 backdrop-blur-sm transition-colors hover:border-[#40c0a0]/40 hover:text-[#101860]"
            >
              ملفي الطبي
              <ArrowLeft size={15} />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 border-t border-white/60 pt-6">
            {[
              { label: "فصيلة الدم", value: MOCK_MEDICAL_PROFILE.blood_type },
              { label: "الملف", value: MOCK_MEDICAL_PROFILE.patient_id },
              { label: "الحالة", value: "نشط" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] font-medium text-slate-400">{item.label}</p>
                <p className="text-sm font-extrabold text-[#101860]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="patient-hero-photo relative">
            <div className="patient-hero-ring" aria-hidden="true" />
            <div className="patient-hero-ring patient-hero-ring--delay" aria-hidden="true" />
            <ProfileAvatar
              src={MOCK_PATIENT_PROFILE.profile_picture}
              name={MOCK_PATIENT_PROFILE.name}
              size="xl"
              className="relative z-10 !h-44 !w-44 border-4 border-white shadow-2xl shadow-blue-900/15 sm:!h-52 sm:!w-52"
            />
            <div className="absolute -bottom-2 start-1/2 z-20 -translate-x-1/2 rounded-full border border-white bg-gradient-to-l from-[#40c0a0] to-emerald-500 px-4 py-1.5 text-xs font-extrabold text-white shadow-md">
              مريض نشط
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PatientWelcomeHero;
