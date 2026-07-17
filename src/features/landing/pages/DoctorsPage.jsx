import { useMemo, useState } from "react";
import { Search, ShieldCheck, Users } from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import { DoctorCard, SectionHeading } from "../components/LandingCards";
import { doctors } from "../data/landingMockData";

const specialties = ["الكل", "القلب", "الأطفال", "العظام", "الطب العام"];

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
      <section className="landing-section landing-section--white border-b border-slate-100/80">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="landing-eyebrow">خدماتنا الطبية</p>
          <h1 className="landing-section-title">ابحث عن طبيبك المناسب</h1>
          <p className="landing-section-desc">
            نخبة من الأطباء والاستشاريين مع مواعيد واضحة وخيارات حضور أو
            استشارة عن بُعد.
          </p>

          <div className="landing-filter-bar mt-8">
            <div className="relative">
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث باسم الطبيب أو التخصص..."
                className="h-12 w-full rounded-full border border-slate-200/80 bg-white pr-11 pl-4 text-sm outline-none transition focus:border-[#101860]/30 focus:ring-4 focus:ring-[#101860]/8"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {specialties.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSpecialty(item)}
                  className={`landing-chip ${specialty === item ? "is-active" : ""}`}
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

      <AnimatedSection className="landing-section mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-[0.7fr_1.3fr] lg:px-8">
        <div className="landing-feature-card p-8">
          <Users size={30} className="text-[#101860]" />
          <h2 className="mt-5 text-xl font-black text-[#101860]">ضمان الخصوصية</h2>
          <p className="mt-3 text-sm leading-8 text-slate-500">
            بياناتك الطبية متاحة فقط لك ولمقدمي الرعاية المخولين.
          </p>
        </div>
        <div className="landing-cta">
          <div className="landing-cta-glow" aria-hidden="true" />
          <ShieldCheck size={34} className="relative text-blue-200" />
          <h2 className="relative mt-5 text-3xl font-black">رعاية صحية ذكية بين يديك</h2>
          <p className="relative mt-3 max-w-2xl text-sm leading-8 text-blue-100/85">
            تجربة حجز مرنة تربطك بالطبيب المناسب وتحفظ تاريخك الطبي في مكان
            واحد.
          </p>
        </div>
      </AnimatedSection>
    </>
  );
}

export default DoctorsPage;
