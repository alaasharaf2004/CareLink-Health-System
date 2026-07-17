import { Link } from "react-router-dom";
import { ArrowLeft, BadgePercent, CalendarDays, Gift, Sparkles } from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import { SectionHeading } from "../components/LandingCards";
import { offers } from "../data/landingMockData";

function OffersPage() {
  return (
    <>
      <section className="landing-section mx-auto max-w-7xl px-5 lg:px-8">
        <div className="landing-page-hero">
          <img
            src="https://images.unsplash.com/photo-1666887360983-2a140838cda0?w=1400&h=700&fit=crop"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative max-w-2xl px-7 py-16 sm:px-12 sm:py-20">
            <span className="landing-hero-badge text-white/90">
              <Sparkles size={14} />
              عروض CareLink
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              صحتك تهمنا بخصم شامل وموثوق
            </h1>
            <p className="mt-4 text-sm leading-8 text-blue-100/85">
              استفد من باقات صحية مختارة تساعدك على الوصول للرعاية بسعر أفضل.
            </p>
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <SectionHeading
          eyebrow="لفترة محدودة"
          title="باقات الرعاية الصحية المتكاملة"
          description="عروض مصممة لتغطية احتياجاتك واحتياجات أسرتك."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <article
              key={offer.id}
              className="landing-card group overflow-hidden p-0"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={offer.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute right-4 top-4 landing-tag bg-[#101860] text-white">
                  <BadgePercent size={13} />
                  {offer.discount}
                </span>
              </div>
              <div className="p-5">
                <h2 className="text-lg font-black text-[#101860]">{offer.title}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {offer.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                    <CalendarDays size={14} />
                    متاح هذا الشهر
                  </span>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-600"
                  >
                    احجز العرض
                    <ArrowLeft size={15} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="landing-section mx-auto max-w-7xl px-5 lg:px-8">
        <div className="landing-cta text-center">
          <div className="landing-cta-glow" aria-hidden="true" />
          <Gift size={34} className="relative mx-auto text-blue-200" />
          <h2 className="relative mt-5 text-3xl font-black">هل تبحث عن عرض مخصص؟</h2>
          <p className="relative mx-auto mt-3 max-w-2xl text-sm leading-8 text-blue-100/85">
            أخبرنا باحتياجك وسيساعدك فريقنا في اختيار الباقة الأنسب.
          </p>
          <Link to="/contact" className="landing-btn-secondary relative mt-7 border-white/25 bg-white/95">
            تواصل معنا
            <ArrowLeft size={16} />
          </Link>
        </div>
      </AnimatedSection>
    </>
  );
}

export default OffersPage;
