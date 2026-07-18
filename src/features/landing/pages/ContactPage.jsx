import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";
import MedicalBackdropIcons from "../components/MedicalBackdropIcons";

const contactChannels = [
  {
    id: "phone",
    icon: Phone,
    label: "اتصال",
    value: "+970 59 123 4567",
    href: "tel:+970591234567",
  },
  {
    id: "email",
    icon: Mail,
    label: "إيميل",
    value: "info@carelink.com",
    href: "mailto:info@carelink.com",
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    label: "واتساب",
    value: "تواصل فوري",
    href: "https://wa.me/970591234567",
  },
];

const contactItems = [
  { icon: Phone, title: "هاتفنا", value: "+970 59 123 4567", dir: "ltr" },
  { icon: Mail, title: "البريد الإلكتروني", value: "info@carelink.com", dir: "ltr" },
  { icon: MapPin, title: "موقعنا", value: "فلسطين، قطاع غزة" },
  { icon: Clock3, title: "أوقات العمل", value: "على مدار الساعة، 7 أيام" },
];

const GAZA_MAP_SRC =
  "https://maps.google.com/maps?q=Gaza%20Palestine&ll=31.5017,34.4668&z=11&hl=ar&output=embed";
const GAZA_MAP_LINK = "https://maps.google.com/maps?q=Gaza+Palestine&z=11";

function ContactPage() {
  const [isSent, setIsSent] = useState(false);
  const [pulseTarget, setPulseTarget] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSent(true);
    event.currentTarget.reset();
  };

  const triggerPulse = (id) => {
    setPulseTarget(id);
    window.setTimeout(() => setPulseTarget(null), 560);
  };

  return (
    <>
      <section className="landing-contact-hero">
        <div className="landing-contact-hero-bg" aria-hidden="true">
          <span className="landing-contact-glow landing-contact-glow--one" />
          <span className="landing-contact-glow landing-contact-glow--two" />
          <span className="landing-contact-glow landing-contact-glow--three" />
          <MedicalBackdropIcons tone="dark" />
          <svg
            className="landing-contact-ecg"
            viewBox="0 0 900 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 40 H140 L160 40 L178 14 L200 66 L222 40 H380 L400 40 L418 18 L440 62 L462 40 H900"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="landing-contact-kicker">نحن قريبون منك</p>
              <h1 className="landing-contact-title">اتصل بنا</h1>
              <p className="landing-contact-lead">
                نحن هنا للإجابة على استفساراتكم وتقديم الرعاية الصحية التي
                تستحقونها. تواصل معنا مباشرة عبر القنوات التالية أو أرسل
                رسالتك من النموذج.
              </p>

              <div className="landing-contact-actions">
                {contactChannels.map(({ id, icon: Icon, label, value, href }) => (
                  <a
                    key={id}
                    href={href}
                    target={id === "whatsapp" ? "_blank" : undefined}
                    rel={id === "whatsapp" ? "noreferrer" : undefined}
                    className={`landing-contact-action ${pulseTarget === id ? "is-pulsing" : ""}`}
                    onClick={() => triggerPulse(id)}
                  >
                    <span className="landing-contact-action-icon">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <strong>{label}</strong>
                      <em dir={id === "phone" || id === "email" ? "ltr" : undefined}>
                        {value}
                      </em>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="landing-contact-media">
              <div className="landing-contact-media-frame">
                <img
                  src="/images/carelink-contact-kiosk.png"
                  alt="مركز دعم ورعاية CareLink"
                  className="landing-contact-media-image"
                />
                <div className="landing-contact-media-shade" aria-hidden="true" />
              </div>
              <div className="landing-contact-media-badge">
                <HeartHandshake size={16} />
                <span>نحن هنا لخدمتك</span>
              </div>
              <div className="landing-contact-media-chip" aria-hidden="true">
                CareLink
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
        <div>
          <h2 className="text-2xl font-black text-[#101860]">معلومات التواصل</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            اختر وسيلة التواصل الأنسب لك.
          </p>
          <div className="mt-6 space-y-3">
            {contactItems.map(({ icon: Icon, title, value, dir }) => (
              <div
                key={title}
                className="landing-card flex items-center gap-4 p-4 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={19} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">{title}</p>
                  <p className="mt-1 text-sm font-extrabold text-[#101860]" dir={dir}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="landing-card p-6 sm:p-8">
          <h2 className="text-2xl font-black text-[#101860]">أرسل لنا رسالة</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-600">
              الاسم الكامل
              <input
                required
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-bold text-slate-600">
              البريد الإلكتروني
              <input
                required
                type="email"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-bold text-slate-600 sm:col-span-2">
              الموضوع
              <input
                required
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-bold text-slate-600 sm:col-span-2">
              الرسالة
              <textarea
                required
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>
          {isSent && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <CheckCircle2 size={17} />
              تم استلام رسالتك بنجاح (نسخة تجريبية).
            </p>
          )}
          <button type="submit" className="landing-btn-primary mt-5">
            <Send size={16} />
            إرسال الرسالة
          </button>
        </form>
      </AnimatedSection>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="landing-map-frame relative overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <iframe
            title="موقع مستشفى CareLink - قطاع غزة"
            src={GAZA_MAP_SRC}
            className="landing-map-iframe"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute right-4 top-4 z-10">
            <a
              href={GAZA_MAP_LINK}
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto block rounded-2xl border border-white/70 bg-white/95 px-5 py-4 text-center shadow-xl backdrop-blur transition-transform hover:-translate-y-1"
            >
              <Building2 size={26} className="mx-auto text-[#101860]" />
              <p className="mt-2 text-sm font-black text-[#101860]">
                مستشفى CareLink
              </p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <MapPin size={13} className="text-[#40c0a0]" />
                فلسطين، قطاع غزة
              </p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
