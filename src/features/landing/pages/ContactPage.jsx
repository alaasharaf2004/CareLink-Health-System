import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import AnimatedSection from "../components/AnimatedSection";

const contactItems = [
  { icon: Phone, title: "هاتفنا", value: "+970 59 000 0000", dir: "ltr" },
  { icon: Mail, title: "البريد الإلكتروني", value: "info@carelink.com", dir: "ltr" },
  { icon: MapPin, title: "موقعنا", value: "فلسطين، قطاع غزة" },
  { icon: Clock3, title: "أوقات العمل", value: "على مدار الساعة، 7 أيام" },
];

const GAZA_MAP_SRC =
  "https://maps.google.com/maps?q=Gaza%20Palestine&ll=31.5017,34.4668&z=11&hl=ar&output=embed";
const GAZA_MAP_LINK = "https://maps.google.com/maps?q=Gaza+Palestine&z=11";

function ContactPage() {
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSent(true);
    event.currentTarget.reset();
  };

  return (
    <>
      <section className="landing-page-hero mx-5 mt-6 lg:mx-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8">
          <div className="relative">
            <p className="text-sm font-extrabold text-blue-200/90">نحن قريبون منك</p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">اتصل بنا</h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-blue-100/85">
              لأي استفسار أو مساعدة في الحجز، تواصل معنا وسيرد عليك فريق
              CareLink في أقرب وقت.
            </p>
          </div>
          <div className="landing-hero-frame relative">
            <img
              src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&h=650&fit=crop"
              alt="فريق الدعم الطبي"
              className="h-64 w-full object-cover lg:h-72"
            />
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
                className="landing-card flex items-center gap-4 p-4"
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

        <form
          onSubmit={handleSubmit}
          className="landing-card p-6 sm:p-8"
        >
          <h2 className="text-2xl font-black text-[#101860]">أرسل لنا رسالة</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-600">
              الاسم الكامل
              <input
                required
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-bold text-slate-600">
              البريد الإلكتروني
              <input
                required
                type="email"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-bold text-slate-600 sm:col-span-2">
              الموضوع
              <input
                required
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-bold text-slate-600 sm:col-span-2">
              الرسالة
              <textarea
                required
                rows={5}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
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
