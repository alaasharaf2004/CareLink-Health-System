import { useLocation } from "react-router-dom";

const PAGE_META = {
  "/patient/dashboard": {
    title: "الرئيسية",
    subtitle: "لوحة المريض",
  },
  "/patient/appointments": {
    title: "المواعيد",
    subtitle: "إدارة مواعيدك",
  },
  "/patient/medical-records": {
    title: "السجلات الطبية",
    subtitle: "تقاريرك ونتائجك",
  },
  "/patient/medical-profile": {
    title: "الملف الطبي",
    subtitle: "بياناتك الصحية",
  },
  "/patient/settings": {
    title: "الإعدادات",
    subtitle: "حسابك الشخصي",
  },
};

function getPageMeta(pathname) {
  if (PAGE_META[pathname]) return PAGE_META[pathname];

  const match = Object.entries(PAGE_META).find(([path]) =>
    pathname.startsWith(`${path}/`)
  );
  return match?.[1] ?? { title: "CareLink", subtitle: "لوحة المريض" };
}

function PatientPageTitle() {
  const { pathname } = useLocation();
  const { title, subtitle } = getPageMeta(pathname);

  return (
    <div className="hidden min-w-0 flex-1 lg:block">
      <h1 className="truncate text-base font-extrabold text-blue-950">{title}</h1>
      <p className="truncate text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

export default PatientPageTitle;
