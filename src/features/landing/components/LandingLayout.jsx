import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowLeft, Menu, X } from "lucide-react";

import CareLinkLogo from "../../../components/CareLinkLogo";
import { fetchLandingSettings, getCmsSiteSettings } from "../data/cmsContent";
import InteractiveBackdrop from "./InteractiveBackdrop";
import LandingFooter from "./LandingFooter";

const ALL_NAV_ITEMS = [
  { to: "/", label: "الرئيسية", end: true, always: true },
  { to: "/doctors", label: "الخدمات", settingKey: "showDoctors" },
  { to: "/faq", label: "الأسئلة الشائعة", settingKey: "showFaq" },
  { to: "/about", label: "عن المنصة", always: true },
  { to: "/contact", label: "اتصل بنا", always: true },
  { to: "/blog", label: "المدونة", settingKey: "showBlog" },
  { to: "/offers", label: "العروض والإعلانات", settingKey: "showOffers" },
];

function LandingLayout() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [siteSettings, setSiteSettings] = useState(() => getCmsSiteSettings());

  useEffect(() => {
    let active = true;
    const load = async () => {
      const settings = await fetchLandingSettings();
      if (!active) return;
      setSiteSettings(settings);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const navItems = ALL_NAV_ITEMS.filter(
    (item) => item.always || siteSettings?.[item.settingKey] !== false
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = ({ isActive }) =>
    `landing-nav-link ${isActive ? "is-active" : ""}`;

  return (
    <div className="landing-shell text-slate-800" dir="rtl">
      <InteractiveBackdrop />
      <header
        className={`landing-header fixed inset-x-0 top-0 z-50 border-b border-transparent ${
          isScrolled ? "is-scrolled" : "bg-[#faf9f7]/75 backdrop-blur-md"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 transition-all lg:px-8 ${
            isScrolled ? "h-[4.25rem]" : "h-20"
          }`}
        >
          <Link to="/" aria-label={`${siteSettings.platformName || "CareLink"} - الرئيسية`}>
            <CareLinkLogo size={isScrolled ? 38 : 42} showText layout="header" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="التنقل الرئيسي">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="hidden rounded-full border border-[#101860]/15 bg-white/80 px-5 py-2.5 text-sm font-extrabold text-[#101860] backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md sm:inline-flex"
            >
              تسجيل الدخول
            </Link>
            <Link to="/doctors" className="landing-btn-primary py-2.5 text-sm">
              احجز الآن
              <ArrowLeft size={15} />
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="rounded-xl p-2.5 text-slate-600 transition-colors hover:bg-white/70 lg:hidden"
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="border-t border-slate-100/80 bg-white/95 px-5 py-4 shadow-xl backdrop-blur-xl lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-[#101860]/8 text-[#101860]"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/login"
                className="mt-2 rounded-full border border-[#101860]/15 px-4 py-3 text-center text-sm font-extrabold text-[#101860] sm:hidden"
              >
                تسجيل الدخول
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="relative z-[1] min-h-screen pt-20">
        <div key={pathname} className="landing-page-enter">
          <Outlet />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

export default LandingLayout;
