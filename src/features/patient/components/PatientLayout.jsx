import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileHeart,
  Home,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";

import CareLinkLogo from "../../../components/CareLinkLogo";
import { useAuth } from "../../authentication/context/AuthContext";
import { MOCK_APPOINTMENTS, MOCK_PATIENT_PROFILE } from "../data/patientMockData";
import PatientPageShell from "./PatientPageShell";
import ProfileAvatar from "./ProfileAvatar";

const NAV_ITEMS = [
  { to: "/patient/dashboard", label: "الرئيسية", icon: Home, end: true },
  { to: "/patient/appointments", label: "المواعيد", icon: CalendarDays },
  {
    to: "/patient/medical-records",
    label: "السجلات الطبية",
    icon: ClipboardList,
  },
  { to: "/patient/medical-profile", label: "الملف الطبي", icon: FileHeart },
  { to: "/patient/settings", label: "الإعدادات", icon: Settings },
];

function PatientLayout() {
  const navigate = useNavigate();
  const { clearSession } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const patientName = MOCK_PATIENT_PROFILE.name;
  const pendingCount = MOCK_APPOINTMENTS.filter(
    (a) =>
      a.patient_name === MOCK_PATIENT_PROFILE.name && a.status === "pending"
  ).length;

  const handleLogout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-l from-[#101860] to-blue-700 text-white shadow-[0_8px_24px_rgba(16,24,96,0.25)]"
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

        <Link to="/patient/dashboard" className="transition-opacity hover:opacity-90">
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
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
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
    <div className="min-h-screen bg-gradient-to-bl from-slate-100 via-[#f8fafc] to-blue-50/30" dir="rtl">
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="cursor-pointer rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label="فتح القائمة"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold leading-tight text-[#101860]">
                لوحة التحكم
              </h1>
              <p className="mt-0.5 hidden text-sm font-semibold tracking-wide text-[#40c0a0] sm:block">
                CareLink Health
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="الإشعارات"
            >
              <Bell size={20} />
              {pendingCount > 0 && (
                <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            <Link
              to="/patient/settings"
              className="flex cursor-pointer items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white py-1.5 pe-3 ps-1.5 shadow-sm transition-all duration-200 hover:border-[#40c0a0]/40 hover:shadow-md"
            >
              <ProfileAvatar
                src={MOCK_PATIENT_PROFILE.profile_picture}
                name={patientName}
                size="md"
              />
              <div className="hidden min-w-0 text-right sm:block">
                <p className="text-sm font-extrabold text-slate-800">{patientName}</p>
                <p className="text-xs text-slate-400">مريض</p>
              </div>
              <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
            </Link>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8 lg:py-8">
          <PatientPageShell>
            <Outlet />
          </PatientPageShell>
        </main>
      </div>
    </div>
  );
}

export default PatientLayout;
