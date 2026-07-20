import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  LogOut,
  Megaphone,
  Menu,
  Newspaper,
  Radio,
  Settings,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import CareLinkLogo from "../../../components/CareLinkLogo";
import { useAuth } from "../../authentication/context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin/staff", label: "الكوادر", icon: Users },
  { to: "/admin/doctors", label: "طلبات الأطباء", icon: UserCheck },
  { to: "/admin/articles", label: "المقالات", icon: BookOpen },
  { to: "/admin/ads", label: "الإعلانات", icon: Megaphone },
  { to: "/admin/broadcasts", label: "نظام البث", icon: Radio },
  { to: "/admin/posts", label: "المنشورات", icon: Newspaper },
  { to: "/admin/patients", label: "المرضى", icon: Users },
  { to: "/admin/appointments", label: "المواعيد", icon: CalendarDays },
  { to: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
  { to: "/admin/profile", label: "الملف الشخصي", icon: User },
];

function AdminLayout() {
  const navigate = useNavigate();
  const { clearSession, profile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminName = profile?.name || "المسؤول";
  const adminInitial = adminName.replace(/^ال/, "").charAt(0) || "م";

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true, state: { authRole: "admin" } });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.28)]"
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
    }`;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="relative mb-6 flex justify-center border-b border-slate-100 pb-5 pt-1">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute left-0 top-0 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          aria-label="إغلاق القائمة"
        >
          <X size={20} />
        </button>

        <Link to="/admin/staff" className="transition-opacity hover:opacity-90">
          <CareLinkLogo
            size={48}
            showText
            layout="form"
            align="center"
            textScale="large"
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setIsSidebarOpen(false)}
            className={navLinkClass}
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={19} />
        تسجيل الخروج
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <aside className="fixed right-0 top-0 z-30 hidden h-screen w-72 border-l border-slate-200 bg-white p-5 lg:block">
        {sidebarContent}
      </aside>

      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="fixed right-0 top-0 z-50 h-screen w-72 border-l border-slate-200 bg-white p-5 animate-[fadeInRight_0.3s_ease_forwards] lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}

      <div className="lg:mr-72">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-5 py-3.5 shadow-sm backdrop-blur-md lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="shrink-0 cursor-pointer rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="فتح القائمة"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="whitespace-nowrap text-base font-extrabold leading-tight text-[#101860] sm:text-xl">
                لوحة تحكم الإدارة
              </h1>
              <p className="mt-0.5 hidden text-sm font-semibold tracking-wide text-[#40c0a0] sm:block">
                CareLink Health
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/admin/ads"
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
              aria-label="الإعلانات"
              title="الإعلانات"
            >
              <Megaphone size={20} />
            </Link>

            <Link
              to="/admin/profile"
              className="group flex cursor-pointer items-center gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white py-1.5 pe-3 ps-1.5 shadow-sm transition-all duration-200 hover:border-[#40c0a0]/40 hover:shadow-md sm:pe-4"
            >
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#101860] via-[#1a2878] to-blue-600 text-[13px] font-extrabold text-white shadow-[0_3px_12px_rgba(16,24,96,0.28)] ring-[2.5px] ring-slate-100 transition-transform duration-200 group-hover:scale-[1.04]">
                  {adminInitial}
                </div>
                <span
                  className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full border-[2px] border-white bg-emerald-500 shadow-sm"
                  aria-hidden="true"
                />
              </div>

              <div
                className="mx-2.5 hidden h-9 w-px shrink-0 bg-slate-200/90 sm:block"
                aria-hidden="true"
              />

              <div className="hidden min-w-0 py-0.5 text-right sm:block">
                <p className="text-[13px] leading-5">
                  <span className="font-bold text-[#40C0A0]">أهلاً بك، </span>
                  <span className="font-extrabold text-[#101860]">{adminName}</span>
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  مسؤول النظام · CareLink
                </p>
              </div>
            </Link>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
