import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  DatabaseZap,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import FaqAccordion from "../components/FaqAccordion";
import {
  ArticleCard,
  DoctorCard,
  SectionHeading,
} from "../components/LandingCards";
import {
  articles,
  doctors,
  faqs,
  testimonials,
} from "../data/landingMockData";

const stats = [
  { value: "24/7", label: "دعم طبي" },
  { value: "500+", label: "طبيب متخصص" },
  { value: "15k+", label: "مراجع سعيد" },
];

function LandingPage() {
  return (
    <>
      <section className="landing-hero">
        <div className="landing-orb landing-orb--one" aria-hidden="true" />
        <div className="landing-orb landing-orb--two" aria-hidden="true" />

        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div
            className="relative z-10 opacity-0"
            style={{ animation: "landingHeroText 1s cubic-bezier(0.22,1,0.36,1) forwards" }}
          >
            <span className="landing-hero-badge">
              <Sparkles size={14} />
              رعاية صحية تبدأ من احتياجك
            </span>

            <h1 className="landing-hero-title">
              صحتك، أولويتنا{" "}
              <span className="landing-gradient-text">القصوى</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-[1.9] text-slate-500 lg:text-lg">
              احجز موعدك الطبي بسهولة، واستكشف أفضل الاختصاصيين في بيئة رقمية
              آمنة ومترابطة تمنحك رعاية أوضح وأسرع.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/doctors" className="landing-btn-primary">
                <CalendarDays size={18} />
                ابدأ الحجز الآن
              </Link>
              <Link to="/#about" className="landing-btn-secondary">
                استكشف خدماتنا
                <ArrowLeft size={16} />
              </Link>
            </div>

            <div className="landing-hero-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="landing-hero-stat">
                  <p className="landing-hero-stat-value">{stat.value}</p>
                  <p className="landing-hero-stat-label">{stat.label}</p>
                  <div className="landing-hero-stat-bar" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-xl opacity-0"
            style={{
              animation:
                "landingHeroVisual 1.05s cubic-bezier(0.22,1,0.36,1) 0.15s forwards",
            }}
          >
            <div
              className="landing-hero-ring absolute -right-6 top-8 h-24 w-24"
              aria-hidden="true"
            />
            <div
              className="landing-hero-ring absolute -left-4 bottom-24 h-16 w-16"
              aria-hidden="true"
            />

            <div className="landing-hero-frame">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=1200&fit=crop&crop=faces"
                alt="طبيب من فريق CareLink"
                className="h-[480px] w-full object-cover object-top sm:h-[560px]"
              />
            </div>

            <div className="landing-hero-float-card -bottom-4 right-2 sm:right-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#101860]/10 to-[#40c0a0]/15 text-[#101860]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-[#101860]">كوادر طبية معتمدة</p>
                <p className="mt-0.5 text-xs text-slate-400">جودة وخبرة موثوقة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection
        as="section"
        className="landing-section landing-section--white border-y border-slate-100/80"
      >
        <div
          id="about"
          className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.72fr_1.5fr] lg:px-8"
        >
          <div className="grid gap-4">
            {[
              {
                icon: ShieldCheck,
                title: "أمان البيانات",
                text: "حماية وخصوصية في كل خطوة من رحلتك الصحية.",
              },
              {
                icon: DatabaseZap,
                title: "استجابة أسرع",
                text: "وصول واضح للمواعيد والتقارير والخدمات.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="landing-feature-card">
                <div className="landing-feature-icon">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-black text-[#101860]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{text}</p>
              </div>
            ))}
          </div>

          <div className="lg:pt-2">
            <p className="landing-eyebrow">من نحن</p>
            <h2 className="landing-section-title">
              نعيد تعريف مفهوم الرعاية الصحية في CareLink
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-[1.9] text-slate-500">
              نؤمن أن الوصول للرعاية الصحية المتميزة يجب أن يكون بسيطاً وفعالاً
              للجميع. مهمتنا الربط المباشر بين المرضى وأفضل الكوادر الطبية عبر
              منصة موثوقة تضمن أعلى معايير الجودة والخصوصية.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["اختصاصيون موثوقون", "حجز سريع", "ملف طبي منظم", "متابعة مستمرة"].map(
                (item) => (
                  <p
                    key={item}
                    className="flex items-center gap-2.5 text-sm font-bold text-slate-600"
                  >
                    <CheckCircle2 size={18} className="text-[#40c0a0]" />
                    {item}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="landing-section mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="اختصاصيون موثوقون"
          title="ابحث عن طبيبك المناسب"
          description="اختر من أطباء متخصصين وفق التخصص والتقييم والموعد الأنسب لك."
          action={{ to: "/doctors", label: "عرض جميع الأطباء" }}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="landing-section landing-section--white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="توعية مستمرة"
            title="آخر التحديثات والنصائح الطبية"
            description="اطّلع على محتوى صحي موثوق يساعدك على اتخاذ قرارات يومية أفضل."
            action={{ to: "/blog", label: "عرض جميع المقالات" }}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="landing-section mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="قصص حقيقية"
          title="ماذا يقول عملاؤنا؟"
          description="آراء مستخدمين اختبروا رحلة CareLink الصحية."
          centered
        />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className="landing-testimonial"
              style={{ "--stagger": `${index * 80}ms` }}
            >
              <div className="relative z-10 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400" />
                ))}
              </div>
              <p className="relative z-10 mt-4 text-sm leading-8 text-slate-500">
                {testimonial.text}
              </p>
              <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#101860] to-[#40c0a0] text-sm font-black text-white">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-[#101860]">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="landing-section landing-section--warm">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[0.65fr_1.35fr] lg:px-8">
          <div>
            <p className="landing-eyebrow">دعمك أولويتنا</p>
            <h2 className="landing-section-title">الأسئلة الشائعة</h2>
            <p className="mt-4 text-sm leading-8 text-slate-500">
              إجابات مباشرة عن الحجز، البيانات الطبية، والمواعيد.
            </p>
            <Link to="/faq" className="landing-link-action mt-6 inline-flex">
              عرض جميع الأسئلة
              <ArrowLeft size={16} />
            </Link>
          </div>
          <FaqAccordion items={faqs.slice(0, 3)} />
        </div>
      </AnimatedSection>

      <AnimatedSection className="landing-section mx-auto max-w-7xl px-5 lg:px-8">
        <div className="landing-cta">
          <div className="landing-cta-grid" aria-hidden="true" />
          <div className="landing-cta-glow" aria-hidden="true" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold text-blue-100/90">ابدأ رحلتك اليوم</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                رعاية صحية ذكية بين يديك
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-blue-100/80">
                سجّل الآن وابدأ إدارة مواعيدك وملفك الطبي من مكان واحد.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-[#101860] transition-transform hover:-translate-y-1"
              >
                إنشاء حساب
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/35 px-7 py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-white/10"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}

export default LandingPage;
