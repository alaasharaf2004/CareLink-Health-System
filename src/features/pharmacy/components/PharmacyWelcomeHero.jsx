import { Link } from "react-router-dom";
import { ArrowLeft, Package, Pill, Search, Sparkles } from "lucide-react";

function PharmacyWelcomeHero({ pending = 0, dispensed = 0, lowStock = 0 }) {
  return (
    <section className="patient-hero relative overflow-hidden rounded-3xl">
      <div className="patient-hero-bg" aria-hidden="true" />
      <div className="patient-hero-shine" aria-hidden="true" />

      <div className="relative grid grid-cols-1 items-center gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <Sparkles size={13} />
            لوحة الصيدلية · CareLink
          </span>

          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#101860] sm:text-4xl">
            جاهز للصرف،{" "}
            <span className="bg-gradient-to-l from-[#40c0a0] to-blue-600 bg-clip-text text-transparent">
              صيدلي CareLink
            </span>
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
            تحقق الهوية، راجع الحساسية، صرّف الوصفة، وأبلغ المريض — كل ذلك من
            لوحة واحدة بسلاسة.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/pharmacy/prescriptions"
              className="workspace-btn-press inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#101860] to-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 hover:shadow-xl"
            >
              <Search size={17} />
              الوصفات
            </Link>
            <Link
              to="/pharmacy/inventory"
              className="workspace-btn-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-bold text-slate-700 backdrop-blur-sm hover:border-[#40c0a0]/40 hover:text-[#101860]"
            >
              <Package size={16} />
              المخزون
              <ArrowLeft size={15} />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 border-t border-white/60 pt-6">
            {[
              { label: "بانتظار الصرف", value: String(pending) },
              { label: "تم الصرف", value: String(dispensed) },
              { label: "تنبيه مخزون", value: String(lowStock) },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] font-medium text-slate-400">{item.label}</p>
                <p className="text-sm font-extrabold text-[#101860]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="patient-hero-photo relative">
            <div className="patient-hero-ring" aria-hidden="true" />
            <div
              className="patient-hero-ring patient-hero-ring--delay"
              aria-hidden="true"
            />
            <div className="relative z-10 flex h-44 w-44 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 text-white shadow-2xl shadow-emerald-900/20 sm:h-52 sm:w-52">
              <Pill size={64} strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-2 start-1/2 z-20 -translate-x-1/2 rounded-full border border-white bg-gradient-to-l from-emerald-600 to-teal-500 px-4 py-1.5 text-xs font-extrabold text-white shadow-md">
              صرف آمن
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PharmacyWelcomeHero;
