import { useEffect, useState } from "react";
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
import HeroStats from "../components/HeroStats";
import {
  ArticleCard,
  DoctorCard,
  SectionHeading,
} from "../components/LandingCards";
import { listPublishedArticles, fetchLandingArticles, fetchLandingDoctors } from "../data/cmsContent";
import { faqs, testimonials } from "../data/landingMockData";

const heroDoctors = [
  {
    src: "/images/carelink-hero-doc-a.png",
    alt: "طبيب من فريق CareLink",
  },
  {
    src: "/images/carelink-hero-doc-b.png",
    alt: "طبيبة من فريق CareLink",
  },
  {
    src: "/images/carelink-hero-doc-c.png",
    alt: "طبيب من فريق CareLink",
  },
  {
    src: "/images/carelink-hero-doc-d.png",
    alt: "طبيبة من فريق CareLink",
  },
];

function LandingPage() {
  const [activeDoctor, setActiveDoctor] = useState(0);
  const [articles, setArticles] = useState(() => listPublishedArticles());
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [nextArticles, nextDoctors] = await Promise.all([
        fetchLandingArticles(),
        fetchLandingDoctors(),
      ]);
      if (!active) return;
      setArticles(nextArticles);
      setDoctors(nextDoctors);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    heroDoctors.forEach((doctor) => {
      const preload = new window.Image();
      preload.src = doctor.src;
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveDoctor((current) => (current + 1) % heroDoctors.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  const showDoctor = (index) => {
    if (index === activeDoctor) return;
    setActiveDoctor(index);
  };

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

            <HeroStats />
          </div>

          <div
            className="landing-hero-visual relative mx-auto w-full max-w-xl opacity-0"
            style={{
              animation:
                "landingHeroVisual 1.05s cubic-bezier(0.22,1,0.36,1) 0.15s forwards",
            }}
          >
            <div className="landing-hero-frame">
              <div className="landing-hero-slideshow" aria-live="polite">
                {heroDoctors.map((doctor, index) => {
                  const isActive = index === activeDoctor;
                  return (
                    <img
                      key={doctor.src}
                      src={doctor.src}
                      alt={isActive ? doctor.alt : ""}
                      aria-hidden={!isActive}
                      className={`landing-hero-slide ${isActive ? "is-active" : ""}`}
                    />
                  );
                })}
              </div>

              <div className="landing-hero-float-card">
                <div className="landing-hero-float-icon" aria-hidden="true">
                  <ShieldCheck size={20} strokeWidth={2.25} />
                </div>
                <div>
                  <p className="landing-hero-float-title">كوادر طبية معتمدة</p>
                  <p className="landing-hero-float-text">
                    جميع أطباؤنا مسجلون رسمياً
                  </p>
                </div>
              </div>

              <div className="landing-hero-dots">
                {heroDoctors.map((doctor, index) => (
                  <button
                    key={doctor.src}
                    type="button"
                    className={index === activeDoctor ? "is-active" : ""}
                    onClick={() => showDoctor(index)}
                    aria-label={`عرض صورة الطبيب ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection
        as="section"
        className="landing-section landing-section--about landing-section--white border-y border-slate-100/80"
      >
        <div
          id="about"
          className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.5fr_0.72fr] lg:items-start lg:px-8"
        >
          <div className="landing-about-copy order-1">
            <p className="landing-about-eyebrow">من نحن</p>
            <h2 className="landing-about-title">
              نعيد تعريف مفهوم الرعاية الصحية في CareLink
            </h2>
            <p className="landing-about-text">
              نؤمن أن الوصول للرعاية الصحية المتميزة يجب أن يكون بسيطاً وفعالاً
              للجميع. مهمتنا الربط المباشر بين المرضى وأفضل الكوادر الطبية عبر
              منصة موثوقة تضمن أعلى معايير الجودة والخصوصية.
            </p>
            <div className="mt-9 grid gap-4 sm:grid-cols-2">
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

          <div className="grid order-2 gap-7">
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
          {doctors.slice(0, 3).map((doctor, index) => (
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
          <FaqAccordion items={faqs.filter((item) => item.category === "الحجز والمواعيد").slice(0, 3)} />
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
