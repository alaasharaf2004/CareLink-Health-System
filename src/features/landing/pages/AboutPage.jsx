import { Link } from "react-router-dom";
import { Eye, Rocket, ShieldCheck } from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import MedicalBackdropIcons from "../components/MedicalBackdropIcons";
import { doctors } from "../data/landingMockData";

const values = [
  {
    number: "01",
    title: "النزاهة",
    text: "نلتزم بأعلى معايير الشفافية والمصداقية في كل تفاعل مع مرضانا وشركائنا.",
  },
  {
    number: "02",
    title: "الابتكار",
    text: "نستثمر باستمرار في أحدث التقنيات لتقديم حلول صحية تسبق التوقعات.",
  },
  {
    number: "03",
    title: "التميز",
    text: "نسعى للكمال في كل تفصيل من تفاصيل رحلة المريض، من الحجز حتى المتابعة.",
  },
];

const journey = [
  {
    year: "2010",
    title: "البداية",
    text: "تأسيس CareLink كمركز استشارات طبية متخصص يضع المريض في صميم التجربة.",
    highlight: false,
  },
  {
    year: "2015",
    title: "التوسع الإقليمي",
    text: "افتتاح 5 فروع جديدة مع مختبرات متقدمة وخدمات رعاية متكاملة.",
    highlight: false,
  },
  {
    year: "2020",
    title: "التحول الرقمي",
    text: "إطلاق منصة CareLink Digital للاستشارات عن بُعد وإدارة السجلات الطبية.",
    highlight: false,
  },
  {
    year: "2024",
    title: "مستقبل الرعاية",
    text: "دمج الذكاء الاصطناعي في التشخيص والرعاية الشخصية لتجربة صحية أذكى.",
    highlight: false,
  },
  {
    year: "2026",
    title: "الرعاية الذكية المتكاملة",
    text: "إطلاق الجيل التالي من CareLink: متابعة صحية استباقية، تكامل أوسع مع المستشفيات، وتجربة مريض موحدة عبر المنطقة.",
    highlight: true,
  },
];

const leaders = doctors
  .filter((doctor) =>
    [
      "د. أحمد المنصوري",
      "د. سارة الكواري",
      "د. خالد الهاشمي",
      "م. عمر فيصل",
    ].includes(doctor.name)
  )
  .map((doctor) => ({
    name: doctor.name,
    role: doctor.specialty,
    image: doctor.image,
  }));

function AboutPage() {
  return (
    <>
      <section className="landing-about-page-hero">
        <div className="landing-about-page-hero-bg" aria-hidden="true">
          <span className="landing-about-hero-orb landing-about-hero-orb--one" />
          <span className="landing-about-hero-orb landing-about-hero-orb--two" />
          <span className="landing-about-hero-orb landing-about-hero-orb--three" />
          <span className="landing-about-hero-mesh" />
          <MedicalBackdropIcons tone="light" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
          <div>
            <p className="landing-eyebrow text-[#40c0a0]">من نحن</p>
            <h1 className="mt-4 text-3xl font-black leading-tight text-[#101860] sm:text-4xl lg:text-[2.65rem]">
              نضع صحتك في قلب التكنولوجيا والابتكار
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-slate-500 sm:text-[0.95rem]">
              CareLink منصة رعاية صحية رقمية تجمع بين الخبرة الطبية والتقنية
              المتقدمة، لتقديم رحلة علاج أوضح، أسرع، وأكثر إنسانية لكل مريض.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#journey" className="landing-btn-primary">
                اكتشف رحلتنا
              </a>
              <Link to="/contact" className="landing-btn-secondary">
                تواصل معنا
              </Link>
            </div>
          </div>

          <div className="landing-about-hero-media">
            <span className="landing-about-hero-ring landing-about-hero-ring--outer" aria-hidden="true" />
            <span className="landing-about-hero-ring landing-about-hero-ring--inner" aria-hidden="true" />
            <span className="landing-about-hero-spark landing-about-hero-spark--one" aria-hidden="true" />
            <span className="landing-about-hero-spark landing-about-hero-spark--two" aria-hidden="true" />
            <span className="landing-about-hero-spark landing-about-hero-spark--three" aria-hidden="true" />
            <div className="landing-about-hero-frame">
              <img
                src="/images/carelink-about-lobby.png"
                alt="استقبال مركز CareLink"
                className="landing-about-hero-image"
              />
            </div>
            <div className="landing-about-trust-badge">
              <span className="landing-about-trust-icon" aria-hidden="true">
                <ShieldCheck size={22} />
              </span>
              <div>
                <strong>+15 عاماً</strong>
                <p>من الخبرة في تقديم حلول الرعاية الصحية المبتكرة والمتكاملة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection className="bg-[#f4f8fb]">
        <div className="mx-auto max-w-7xl space-y-6 px-5 py-16 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="landing-about-mission-card">
              <span className="landing-about-mission-icon" aria-hidden="true">
                <Rocket size={20} />
              </span>
              <h2>رسالتنا</h2>
              <p>
                تمكين كل فرد من إدارة صحته بسهولة عبر منصة موثوقة تربط المرضى
                بالأطباء والخدمات الطبية في تجربة واحدة سلسة وآمنة.
              </p>
            </article>

            <article className="landing-about-vision-card">
              <span className="landing-about-vision-icon" aria-hidden="true">
                <Eye size={20} />
              </span>
              <h2>رؤيتنا</h2>
              <p>
                أن نكون المنصة الصحية الرائدة في المنطقة، حيث تلتقي التكنولوجيا
                بالرعاية الإنسانية لصحة أفضل للجميع.
              </p>
            </article>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <article key={value.number} className="landing-about-value-card">
                <span>{value.number}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <section id="journey" className="landing-about-journey">
        <div className="landing-about-journey-bg" aria-hidden="true">
          <span className="landing-about-journey-orb landing-about-journey-orb--one" />
          <span className="landing-about-journey-orb landing-about-journey-orb--two" />
          <span className="landing-about-journey-orb landing-about-journey-orb--three" />
          <span className="landing-about-journey-grid" />
          <MedicalBackdropIcons tone="light" />
          <svg
            className="landing-about-journey-pulse"
            viewBox="0 0 900 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 40 H150 L168 40 L186 14 L208 66 L230 40 H420 L438 40 L456 18 L478 62 L500 40 H900"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-5 py-20 lg:px-8 lg:py-24">
          <AnimatedSection className="text-center">
            <p className="landing-eyebrow mx-auto justify-center text-[#40c0a0]">
              مسار النمو
            </p>
            <h2 className="landing-section-title mt-3">
              رحلة CareLink عبر الزمن
            </h2>
            <p className="landing-section-desc mx-auto mt-3 max-w-2xl">
              كيف بدأنا وكيف نواصل النمو والابتكار لصحة أوضح وأكثر قرباً منك
            </p>
          </AnimatedSection>

          <div className="landing-about-timeline" aria-label="المسار الزمني لـ CareLink">
            <div className="landing-about-timeline-line" aria-hidden="true" />

            {journey.map((item, index) => (
              <AnimatedSection
                key={item.year}
                className={`landing-about-timeline-item ${index % 2 === 0 ? "is-start" : "is-end"} ${item.highlight ? "is-highlight" : ""}`}
                delay={index * 110}
              >
                <article className="landing-about-timeline-card">
                  <span className="landing-about-timeline-tag">{item.year}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
                <div className="landing-about-timeline-node" aria-hidden="true">
                  <span className="landing-about-timeline-ring" />
                  <span className="landing-about-timeline-ring landing-about-timeline-ring--delayed" />
                  <span className="landing-about-timeline-year">{item.year}</span>
                </div>
                <div className="landing-about-timeline-spacer" aria-hidden="true" />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-5 pb-8 lg:px-8">
        <div className="landing-about-ai">
          <div className="landing-about-ai-visual">
            <img
              src="/images/carelink-about-ai.png"
              alt="تصور الذكاء الاصطناعي في CareLink"
            />
          </div>
          <div className="landing-about-ai-copy">
            <span className="landing-about-ai-badge">تكنولوجيا الغد</span>
            <h2>الذكاء الاصطناعي في خدمة الإنسانية</h2>
            <p>
              لا نستخدم التقنية فحسب، بل نطوّرها عبر الذكاء الاصطناعي والبيانات
              الضخمة للتنبؤ بالمخاطر الصحية وتقديم رعاية مخصصة لكل مريض.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="text-center">
          <h2 className="landing-section-title">نخبة العقول الطبية</h2>
          <p className="landing-section-desc mx-auto mt-3 max-w-2xl">
            فريق القيادة والخبراء الذين يصنعون الفرق كل يوم
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((leader) => (
            <article key={leader.name} className="landing-about-leader">
              <div className="landing-about-leader-photo">
                <img src={leader.image} alt={leader.name} />
              </div>
              <h3>{leader.name}</h3>
              <p>{leader.role}</p>
            </article>
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}

export default AboutPage;
