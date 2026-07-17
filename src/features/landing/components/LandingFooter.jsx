import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";

import CareLinkLogo from "../../../components/CareLinkLogo";

const quickLinks = [
  { to: "/doctors", label: "استكشف الأطباء" },
  { to: "/blog", label: "النصائح الطبية" },
  { to: "/faq", label: "الأسئلة الشائعة" },
  { to: "/contact", label: "تواصل معنا" },
  { to: "/offers", label: "العروض والإعلانات" },
];

const services = [
  "حجز المواعيد",
  "الاستشارات عن بُعد",
  "السجلات الطبية",
  "نتائج المختبر والأشعة",
];

const socialLinks = [
  { icon: Globe2, label: "الموقع" },
  { icon: MessageCircle, label: "واتساب" },
  { icon: Share2, label: "مشاركة" },
];

function LandingFooter() {
  const footerRef = useRef(null);
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.45, active: false });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    const canvas = canvasRef.current;
    if (!footer || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const supportsPointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let offset = 0;
    let raf = 0;

    const resize = () => {
      width = footer.clientWidth;
      height = footer.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawPulseBand = (yBase, alpha, scale, speed) => {
      const segment = 68 * scale;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(236, 242, 255, ${alpha})`;
      ctx.lineWidth = 1.15 * scale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      let started = false;
      for (let x = -segment; x < width + segment; x += 2.5) {
        const local = ((x + offset * speed) % segment + segment) % segment;
        const t = local / segment;
        const px = t * 28;
        let py = 0;
        if (px < 5) py = 0;
        else if (px < 7.5) py = ((px - 5) / 2.5) * -6;
        else if (px < 11) py = -6 + ((px - 7.5) / 3.5) * 18;
        else if (px < 14.5) py = 12 + ((px - 11) / 3.5) * -22;
        else if (px < 17.5) py = -10 + ((px - 14.5) / 3) * 17;
        else if (px < 20) py = 7 + ((px - 17.5) / 2.5) * -7;
        else py = 0;

        const y = yBase + py * scale;
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    const draw = () => {
      offset += reduceMotion ? 0 : 1.15;
      ctx.clearRect(0, 0, width, height);

      const { x, y, active } = pointerRef.current;
      const px = x * width;
      const py = y * height;

      // Soft interactive glow
      const glow = ctx.createRadialGradient(px, py, 0, px, py, 300);
      glow.addColorStop(
        0,
        active ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)"
      );
      glow.addColorStop(0.4, "rgba(64,192,160,0.03)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const boost = active ? 1.2 : 1;
      const bands = [
        { y: 0.28, alpha: 0.04, scale: 1.0, speed: 0.95 },
        { y: 0.52, alpha: 0.045, scale: 1.1, speed: 1.1 },
        { y: 0.76, alpha: 0.035, scale: 0.95, speed: 0.8 },
      ];

      bands.forEach((band) => {
        drawPulseBand(
          height * band.y,
          band.alpha * boost,
          band.scale,
          band.speed
        );
      });

      // Tiny pulse near pointer when hovering
      if (active && supportsPointer) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const points = [
          [-32, 0],
          [-16, 0],
          [-9, -9],
          [0, 16],
          [9, -11],
          [16, 7],
          [23, 0],
          [40, 0],
        ];
        points.forEach(([dx, dy], i) => {
          if (i === 0) ctx.moveTo(px + dx, py + dy);
          else ctx.lineTo(px + dx, py + dy);
        });
        ctx.stroke();
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event) => {
      const rect = footer.getBoundingClientRect();
      pointerRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
        active: true,
      };
      footer.style.setProperty(
        "--footer-x",
        `${((event.clientX - rect.left) / rect.width) * 100}%`
      );
      footer.style.setProperty(
        "--footer-y",
        `${((event.clientY - rect.top) / rect.height) * 100}%`
      );
      footer.classList.add("is-active");
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      footer.classList.remove("is-active");
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    if (supportsPointer) {
      footer.addEventListener("pointermove", handlePointerMove);
      footer.addEventListener("pointerleave", handlePointerLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      footer.removeEventListener("pointermove", handlePointerMove);
      footer.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    window.setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer ref={footerRef} className="landing-footer relative z-[1]">
      <canvas
        ref={canvasRef}
        className="landing-footer-pulse-bg"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <CareLinkLogo size={40} showText layout="header" onDark />
          <p className="mt-5 text-sm leading-8 text-slate-400">
            رعاية صحية متصلة وآمنة، تجمع المريض والطبيب وخدمات المستشفى في
            تجربة واحدة واضحة.
          </p>
          <div className="mt-6 flex gap-2.5">
            {socialLinks.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#social"
                aria-label={label}
                className="landing-footer-social"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="landing-footer-title">روابط سريعة</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to} className="landing-footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="landing-footer-title">خدماتنا الطبية</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            {services.map((service) => (
              <li key={service} className="landing-footer-service-item">
                <span className="landing-footer-dot" aria-hidden="true" />
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="landing-footer-title">ابقَ على تواصل</h3>
          <p className="mt-5 text-sm leading-8 text-slate-400">
            اشترك ليصلك أحدث المحتوى والعروض الصحية.
          </p>
          <form className="landing-footer-form mt-5" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-label="البريد الإلكتروني"
              placeholder="بريدك الإلكتروني"
              required
            />
            <button type="submit">اشترك</button>
          </form>
          {subscribed && (
            <p className="mt-3 text-xs font-bold text-[#40c0a0]">
              تم الاشتراك بنجاح
            </p>
          )}
          <div className="mt-5 space-y-2.5 text-xs text-slate-400">
            <a
              href="mailto:info@carelink.com"
              className="landing-footer-contact"
              dir="ltr"
            >
              <Mail size={14} /> info@carelink.com
            </a>
            <a
              href="tel:+970591234567"
              className="landing-footer-contact"
              dir="ltr"
            >
              <Phone size={14} /> +970 59 123 4567
            </a>
            <p className="landing-footer-contact">
              <MapPin size={14} /> فلسطين، قطاع غزة
            </p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-5 py-5 text-center text-xs text-slate-500">
        © 2026 CareLink Health System. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}

export default LandingFooter;
