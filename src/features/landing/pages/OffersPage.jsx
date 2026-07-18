import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  MapPin,
  ShoppingCart,
} from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import MedicalBackdropIcons from "../components/MedicalBackdropIcons";
import { offers, partnerAds } from "../data/landingMockData";

function getVisibleCount() {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(max-width: 639px)").matches) return 1;
  if (window.matchMedia("(max-width: 899px)").matches) return 2;
  return 3;
}

function OffersPage() {
  const [activeOffer, setActiveOffer] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);
  const [slidePx, setSlidePx] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const viewportRef = useRef(null);

  const maxIndex = Math.max(0, offers.length - visibleCount);

  useEffect(() => {
    const updateVisible = () => setVisibleCount(getVisibleCount());
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  useEffect(() => {
    setActiveOffer((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const card = viewport.querySelector(".landing-offer-card");
      if (!card) return;
      const styles = window.getComputedStyle(viewport.querySelector(".landing-offers-track"));
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 20;
      const step = card.getBoundingClientRect().width + gap;
      setSlidePx(activeOffer * step);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeOffer, visibleCount, offers.length]);

  useEffect(() => {
    if (maxIndex <= 0) return undefined;

    const timer = window.setInterval(() => {
      setActiveOffer((current) => (current >= maxIndex ? 0 : current + 1));
    }, 5200);
    return () => window.clearInterval(timer);
  }, [maxIndex]);

  const goPrev = () => {
    setActiveOffer((current) => (current <= 0 ? maxIndex : current - 1));
  };

  const goNext = () => {
    setActiveOffer((current) => (current >= maxIndex ? 0 : current + 1));
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <>
      <section className="landing-offers-hero-wrap">
        <div className="landing-offers-hero-wrap-bg" aria-hidden="true">
          <span className="landing-offers-page-orb landing-offers-page-orb--one" />
          <span className="landing-offers-page-orb landing-offers-page-orb--two" />
          <MedicalBackdropIcons tone="light" />
          <svg
            className="landing-offers-page-ecg"
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

        <div className="landing-offers-hero">
          <div className="landing-offers-hero-bg" aria-hidden="true">
            <span className="landing-offers-orb landing-offers-orb--one" />
            <span className="landing-offers-orb landing-offers-orb--two" />
            <span className="landing-offers-orb landing-offers-orb--three" />
            <MedicalBackdropIcons tone="dark" />
            <svg
              className="landing-offers-ecg"
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

          <div className="landing-offers-hero-copy">
            <span className="landing-offers-hero-badge">عرض لفترة محدودة</span>
            <h1>صحتك تبدأ بفحص شامل ودقيق</h1>
            <p>
              خصم يصل إلى 40% على الفحوصات الشاملة هذا الشهر بإشراف نخبة من
              الأطباء، مع تجربة حجز سلسة عبر CareLink.
            </p>
            <div className="landing-offers-hero-actions">
              <Link to="/doctors" className="landing-offers-hero-primary">
                <CalendarDays size={17} />
                احجز موعدك الآن
              </Link>
              <a href="#packages" className="landing-offers-hero-secondary">
                تفاصيل العرض
              </a>
            </div>
          </div>

          <div className="landing-offers-hero-media">
            <div className="landing-offers-hero-frame">
              <img src="/images/carelink-offers-hero.png" alt="عرض CareLink الصحي" />
            </div>
            <span className="landing-offers-hero-glow" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="packages" className="landing-offers-packages">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <AnimatedSection className="landing-offers-packages-head">
            <div>
              <p className="landing-eyebrow text-[#40c0a0]">لفترة محدودة</p>
              <h2 className="landing-section-title mt-3">
                باقات الرعاية الصحية المتكاملة
              </h2>
              <p className="landing-section-desc mt-3 max-w-2xl">
                عروض مختارة بعناية لتغطية احتياجاتك واحتياجات أسرتك بأسعار أوضح.
              </p>
            </div>
            <div className="landing-offers-nav">
              <button type="button" onClick={goPrev} aria-label="السابق">
                <ArrowRight size={18} />
              </button>
              <button type="button" onClick={goNext} aria-label="التالي">
                <ArrowLeft size={18} />
              </button>
            </div>
          </AnimatedSection>

          <div
            ref={viewportRef}
            className="landing-offers-viewport"
            dir="ltr"
            style={{ "--offers-visible": visibleCount }}
          >
            <div
              className="landing-offers-track"
              style={{ transform: `translate3d(-${slidePx}px, 0, 0)` }}
            >
              {offers.map((offer, index) => {
                const isActive = index >= activeOffer && index < activeOffer + visibleCount;
                return (
                  <article
                    key={offer.id}
                    dir="rtl"
                    className={`landing-offer-card ${isActive ? "is-active" : ""}`}
                    style={{ "--offer-delay": `${index * 90}ms` }}
                  >
                    {offer.badge && (
                      <span className="landing-offer-ribbon">{offer.badge}</span>
                    )}
                    <div className="landing-offer-media">
                      <img src={offer.image} alt="" loading="lazy" />
                    </div>
                    <div className="landing-offer-body">
                      <h3>{offer.title}</h3>
                      <p>{offer.description}</p>
                      <div className="landing-offer-price-row">
                        <div>
                          <strong>
                            {offer.price}
                            <em>{offer.currency}</em>
                          </strong>
                          <span>
                            {offer.oldPrice}
                            {offer.currency}
                          </span>
                        </div>
                        <Link
                          to="/doctors"
                          className="landing-offer-cart"
                          aria-label="احجز الباقة"
                        >
                          <ShoppingCart size={18} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="landing-offers-dots" aria-label="صفحات الباقات">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                className={index === activeOffer ? "is-active" : ""}
                onClick={() => setActiveOffer(index)}
                aria-label={`الشريحة ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection className="landing-offers-partners">
        <div className="landing-offers-partners-bg" aria-hidden="true">
          <span />
          <span />
          <MedicalBackdropIcons tone="light" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="text-center">
            <h2 className="landing-section-title">إعلانات مميزة من شركائنا</h2>
            <p className="landing-section-desc mx-auto mt-3 max-w-2xl">
              نتعاون مع مراكز طبية مختارة لنقدم لك خدمات أوضح وأقرب.
            </p>
          </div>

          <div className="landing-offers-partners-grid">
            {partnerAds.map((ad, index) => (
              <article
                key={ad.id}
                className="landing-partner-card"
                style={{ "--partner-delay": `${index * 120}ms` }}
              >
                <div className="landing-partner-copy">
                  <h3>{ad.title}</h3>
                  <p>{ad.description}</p>
                  <div className="landing-partner-meta">
                    <span>
                      <MapPin size={14} />
                      {ad.location}
                    </span>
                    <Link to="/doctors">
                      احجز الآن
                      <ChevronLeft size={15} />
                    </Link>
                  </div>
                </div>
                <div className="landing-partner-avatar" aria-hidden="true">
                  <span className="landing-partner-avatar-ring" />
                  <span className="landing-partner-avatar-glow" />
                  <div className="landing-partner-avatar-media">
                    <img src={ad.image} alt="" loading="lazy" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="landing-offers-subscribe">
          <div className="landing-offers-subscribe-bg" aria-hidden="true">
            <span />
            <span />
            <MedicalBackdropIcons tone="dark" />
          </div>
          <div className="relative z-10 text-center">
            <h2>هل تبحث عن عرض مخصص؟</h2>
            <p>
              اشترك ليصلك أحدث العروض الطبية والخصومات المختارة مباشرة إلى بريدك.
            </p>
            <form onSubmit={handleSubscribe} className="landing-offers-subscribe-form">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
              <button type="submit">اشترك الآن</button>
            </form>
            {subscribed && (
              <p className="landing-offers-subscribe-ok">
                تم الاشتراك بنجاح (نسخة تجريبية).
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default OffersPage;
