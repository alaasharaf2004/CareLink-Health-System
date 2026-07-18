import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

import CareLinkLogo from "../../../components/CareLinkLogo";
import { useAuth } from "../../authentication/context/AuthContext";

function StaffWorkspaceLayout({ title, navItems, homePath, logoutPath = "/login" }) {
  const navigate = useNavigate();
  const { clearSession } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    navigate(logoutPath, { replace: true });
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
        <Link to={homePath} className="transition-opacity hover:opacity-90">
          <CareLinkLogo size={48} showText layout="form" align="center" textScale="large" />
        </Link>
      </div>

      <p className="mb-3 px-2 text-xs font-extrabold text-slate-400">{title}</p>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map(({ to, label, icon: Icon }) => (
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
        className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
      >
        <LogOut size={19} />
        تسجيل الخروج
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-l border-slate-200 bg-white p-4 lg:block">
          {sidebarContent}
        </aside>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="إغلاق"
            />
            <aside className="absolute inset-y-0 right-0 w-72 bg-white p-4 shadow-xl">
              {sidebarContent}
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base font-extrabold text-blue-950">{title}</h1>
            <span className="w-9" />
          </header>
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default StaffWorkspaceLayout;
