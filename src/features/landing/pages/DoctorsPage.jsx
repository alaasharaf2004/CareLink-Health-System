import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShieldCheck } from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import { DoctorCard, SectionHeading } from "../components/LandingCards";
import MedicalBackdropIcons from "../components/MedicalBackdropIcons";
import { doctors } from "../data/landingMockData";

const specialties = [
  "الكل",
  "القلب",
  "الأطفال",
  "العظام",
  "الطب العام",
  "الجلدية",
  "النساء",
];

const trustAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
];

function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("الكل");

  const filteredDoctors = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesQuery =
        !normalized ||
        doctor.name.toLowerCase().includes(normalized) ||
        doctor.specialty.toLowerCase().includes(normalized);
      const matchesSpecialty =
        specialty === "الكل" || doctor.specialty.includes(specialty);
      return matchesQuery && matchesSpecialty;
    });
  }, [query, specialty]);

  return (
    <>
      <section className="landing-doctors-hero">
        <div className="landing-doctors-hero-bg" aria-hidden="true">
          <span className="landing-doctors-orb landing-doctors-orb--one" />
          <span className="landing-doctors-orb landing-doctors-orb--two" />
          <span className="landing-doctors-orb landing-doctors-orb--three" />
          <MedicalBackdropIcons tone="light" />
          <svg
            className="landing-doctors-ecg"
            viewBox="0 0 900 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 40 H140 L158 40 L176 12 L198 68 L220 40 H380 L398 40 L416 16 L438 64 L460 40 H900"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
          <div className="landing-doctors-hero-copy">
            <p className="landing-eyebrow text-[#40c0a0]">خدماتنا الطبية</p>
            <h1 className="landing-section-title mt-3">ابحث عن طبيبك المناسب</h1>
            <p className="landing-section-desc mt-3 max-w-2xl">
              نخبة من الأطباء والاستشاريين مع مواعيد واضحة وخيارات حضور أو
              استشارة عن بُعد.
            </p>
          </div>

          <div className="landing-doctors-search-panel">
            <div className="landing-doctors-search">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث باسم الطبيب أو التخصص..."
              />
            </div>
            <div className="landing-doctors-chips">
              {specialties.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSpecialty(item)}
                  className={`landing-chip ${specialty === item ? "is-active" : ""}`}
                  style={{ "--chip-delay": `${index * 60}ms` }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection className="landing-section mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          title="الأطباء المتاحون"
          description={`${filteredDoctors.length} أطباء مطابقون لاختيارك`}
        />
        {filteredDoctors.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </div>
        ) : (
          <div className="landing-card py-16 text-center">
            <p className="font-bold text-slate-500">لا توجد نتائج مطابقة.</p>
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection className="landing-section mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <div className="landing-cta flex flex-col justify-between gap-8 p-8 sm:p-10">
          <div className="landing-cta-glow" aria-hidden="true" />
          <div className="relative">
            <h2 className="text-3xl font-black leading-snug sm:text-4xl">
              رعاية صحية ذكية بين يديك
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-blue-100/85 sm:text-base">
              نحن نستخدم أحدث التقنيات لنربطك بأفضل الكفاءات الطبية، تجربة حجز
              سلسة، متابعة دقيقة، وتقارير فورية.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Link
              to="/about"
              className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#101860] transition hover:-translate-y-0.5"
            >
              تعرف على خدماتنا
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-white/40 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
            >
              تواصل معنا
            </Link>
          </div>
        </div>

        <div className="landing-feature-card flex flex-col justify-between p-8">
          <div>
            <div className="landing-feature-icon">
              <ShieldCheck size={20} />
            </div>
            <h2 className="mt-5 text-xl font-black text-[#101860]">
              ضمان الخصوصية
            </h2>
            <p className="mt-3 text-sm leading-8 text-slate-500">
              بياناتك الطبية مشفرة بالكامل ومحمية بأعلى معايير الأمان الدولية.
            </p>
          </div>
          <div className="mt-8 flex items-center justify-between gap-3">
            <div className="flex -space-x-2 space-x-reverse">
              {trustAvatars.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <p className="text-xs font-bold text-[#101860]">
              +2,000 مريض يثقون بنا
            </p>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}

export default DoctorsPage;
