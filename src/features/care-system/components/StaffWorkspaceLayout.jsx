import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

import CareLinkLogo from "../../../components/CareLinkLogo";
import { useAuth } from "../../authentication/context/AuthContext";
import NotificationsBell from "../../patient/components/NotificationsBell";
import { staggerDelay } from "../../patient/utils/staggerDelay";
import { useBroadcastNotifications } from "../hooks/useBroadcastNotifications";
import StaffPageShell from "./StaffPageShell";

function StaffWorkspaceLayout({
  title,
  subtitle = "CareLink Health",
  roleLabel = "موظف",
  roleKey = "reception",
  navItems,
  homePath,
  logoutPath = "/login",
}) {
  const navigate = useNavigate();
  const { clearSession, profile, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const broadcastNotifications = useBroadcastNotifications(roleKey || role || "reception");

  const displayName = profile?.name || roleLabel;
  const initial = displayName.replace(/^د\.\s*|^م\.\s*|^صي\.\s*|^فني\.\s*|^ال/, "").charAt(0) || "م";

  const handleLogout = () => {
    clearSession();
    navigate(logoutPath, { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `workspace-nav-link flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
      isActive
        ? "workspace-nav-active bg-gradient-to-l from-[#101860] to-blue-700 text-white shadow-[0_8px_24px_rgba(16,24,96,0.25)]"
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
    }`;

  const sidebarContent = (
    <div className="workspace-sidebar-in flex h-full flex-col">
      <div className="relative mb-6 flex justify-center border-b border-slate-100 pb-5 pt-1">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute left-0 top-0 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 lg:hidden"
          aria-label="إغلاق القائمة"
        >
          <X size={20} />
        </button>
        <Link to={homePath} className="transition-opacity hover:opacity-90">
          <CareLinkLogo size={48} showText layout="form" align="center" textScale="large" />
        </Link>
      </div>

      <p className="mb-3 px-2 text-xs font-extrabold text-slate-400">{title}</p>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map(({ to, label, icon: Icon, end }, index) => (
          <div
            key={`${to}-${label}`}
            className="workspace-nav-item"
            style={{ animationDelay: staggerDelay(index, 0.05, 0.08) }}
          >
            <NavLink
              to={to}
              end={end}
              onClick={() => setIsSidebarOpen(false)}
              className={navLinkClass}
            >
              <Icon size={19} className="workspace-nav-icon" />
              {label}
            </NavLink>
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="workspace-btn-press mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-rose-600"
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
        <header className="workspace-chrome-in sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-5 py-3.5 shadow-sm backdrop-blur-md lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="workspace-btn-press shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="فتح القائمة"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="whitespace-nowrap text-base font-extrabold leading-tight text-[#101860] sm:text-xl">
                {title}
              </h1>
              <p className="mt-0.5 hidden text-sm font-semibold tracking-wide text-[#40c0a0] sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <NotificationsBell notifications={broadcastNotifications} />
            <div className="workspace-profile-chip flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white py-1.5 pe-3 ps-1.5 shadow-sm hover:border-blue-200 hover:shadow-md sm:pe-4">
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#101860] via-[#1a2878] to-blue-600 text-[13px] font-extrabold text-white ring-[2.5px] ring-slate-100">
                  {initial}
                </div>
                <span className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full border-[2px] border-white bg-emerald-500" />
              </div>
              <div className="mx-2 hidden h-9 w-px bg-slate-200/90 sm:block" />
              <div className="hidden min-w-0 text-right sm:block">
                <p className="text-[13px] leading-5">
                  <span className="font-bold text-[#40C0A0]">أهلاً بك، </span>
                  <span className="font-extrabold text-[#101860]">{displayName}</span>
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                  {roleLabel} · CareLink
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8 lg:py-8">
          <StaffPageShell>
            <Outlet />
          </StaffPageShell>
        </main>
      </div>
    </div>
  );
}

export default StaffWorkspaceLayout;
