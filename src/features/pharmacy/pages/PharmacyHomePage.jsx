import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Package,
  PackageCheck,
  Phone,
  Pill,
  Search,
  UserRound,
} from "lucide-react";

import Toast from "../../admin/components/Toast";
import { useToast } from "../../admin/hooks/useToast";
import { careSystemStore } from "../../care-system/data/careSystemStore";
import FadeUp from "../../patient/components/FadeUp";
import { staggerDelay } from "../../patient/utils/staggerDelay";
import DispenseVerifyModal from "../components/DispenseVerifyModal";
import PharmacyWelcomeHero from "../components/PharmacyWelcomeHero";

function mapPrescription(rx, patientName, doctorName) {
  const patient = careSystemStore.getPatient(rx.patientId);
  return {
    ...rx,
    patient: rx.patientName || patientName(rx.patientId) || patient?.name || "مريض",
    phone: rx.patientPhone || patient?.phone || "",
    nationalId: rx.nationalId || patient?.nationalId || "",
    doctor: doctorName(rx.doctorId),
  };
}

function PharmacyHomePage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    dispensed: 0,
    latestPending: [],
  });
  const [dispenseTarget, setDispenseTarget] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const { toast, showToast, hideToast } = useToast();

  const reload = () => {
    const { patientName, doctorName } = careSystemStore.resolveNames();
    const list = careSystemStore
      .listPrescriptions()
      .map((rx) => mapPrescription(rx, patientName, doctorName));
    const pending = list.filter((rx) => rx.status !== "dispensed");
    setStats({
      total: list.length,
      pending: pending.length,
      dispensed: list.filter((rx) => rx.status === "dispensed").length,
      latestPending: pending.slice(0, 5),
    });
    setLowStock(careSystemStore.getLowStockItems());
  };

  useEffect(() => {
    reload();
    const onStorage = (event) => {
      if (event.key === "carelink_care_system_v2" || event.key === null) reload();
    };
    let channel;
    try {
      channel = new BroadcastChannel("carelink-store");
      channel.onmessage = () => reload();
    } catch {
      channel = null;
    }
    window.addEventListener("carelink-store-updated", reload);
    window.addEventListener("storage", onStorage);
    const timer = window.setInterval(reload, 2500);
    return () => {
      window.removeEventListener("carelink-store-updated", reload);
      window.removeEventListener("storage", onStorage);
      window.clearInterval(timer);
      try {
        channel?.close();
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      <Toast toast={toast} onClose={hideToast} />

      <div className="opacity-0 animate-[formFadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        <PharmacyWelcomeHero
          pending={stats.pending}
          dispensed={stats.dispensed}
          lowStock={lowStock.length}
        />
      </div>

      <FadeUp index={1}>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/pharmacy/inventory"
            className="workspace-btn-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-amber-200 hover:bg-amber-50/50"
          >
            <Package size={16} />
            المخزون
            {lowStock.length ? (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800 animate-[patientPulseSoft_2s_ease-in-out_infinite]">
                {lowStock.length}
              </span>
            ) : null}
          </Link>
          <Link
            to="/pharmacy/history"
            className="workspace-btn-press inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            سجل الصرف
          </Link>
          <Link
            to="/pharmacy/prescriptions"
            className="workspace-btn-press inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-200/50 hover:bg-blue-700"
          >
            <Search size={16} />
            البحث في الوصفات
          </Link>
        </div>
      </FadeUp>

      {lowStock.length > 0 ? (
        <FadeUp index={2}>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 shadow-sm animate-[patientPulseSoft_2.4s_ease-in-out_infinite]">
            تنبيه مخزون: {lowStock.map((item) => item.name).join(" · ")} — الكمية
            عند الحد الأدنى أو أقل.
          </div>
        </FadeUp>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "إجمالي الوصفات",
            value: stats.total,
            icon: Pill,
            className: "border-slate-200 bg-white",
            valueClass: "text-[#101860]",
            iconClass: "bg-blue-50 text-blue-600",
            labelClass: "text-slate-500",
          },
          {
            label: "بانتظار الصرف",
            value: stats.pending,
            icon: Clock3,
            className: "border-amber-100 bg-amber-50/80",
            valueClass: "text-amber-800",
            iconClass: "bg-amber-100 text-amber-700",
            labelClass: "text-amber-700",
          },
          {
            label: "تم الصرف",
            value: stats.dispensed,
            icon: CheckCircle2,
            className: "border-emerald-100 bg-emerald-50/80",
            valueClass: "text-emerald-800",
            iconClass: "bg-emerald-100 text-emerald-700",
            labelClass: "text-emerald-700",
          },
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`workspace-stat-chip workspace-quick-tile rounded-2xl border p-5 shadow-sm opacity-0 animate-[formFadeUp_0.5s_ease_forwards] ${card.className}`}
              style={{ animationDelay: staggerDelay(index, 0.07, 0.12) }}
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`text-xs font-bold ${card.labelClass}`}>{card.label}</p>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 hover:scale-110 ${card.iconClass}`}
                >
                  <Icon size={18} />
                </span>
              </div>
              <p className={`mt-4 text-3xl font-black tabular-nums ${card.valueClass}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <FadeUp index={3}>
        <section className="patient-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-blue-950">
                وصفات بانتظار الصرف
              </h2>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                الصرف يمر عبر التحقق من الهوية وتنبيه الحساسية إن وُجد
              </p>
            </div>
            <Link
              to="/pharmacy/prescriptions"
              className="workspace-btn-press inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
            >
              كل الوصفات
              <ArrowLeft size={15} />
            </Link>
          </div>

          {stats.latestPending.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-12 text-center">
              <Pill size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 font-bold text-slate-600">لا توجد وصفات بانتظار الصرف</p>
              <p className="mt-1 text-sm text-slate-500">
                عندما يرسل الطبيب وصفة ستظهر هنا باسم المريض ورقمه.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {stats.latestPending.map((rx, index) => (
                <li
                  key={rx.id}
                  className="workspace-list-row flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 opacity-0 animate-[patientSlideIn_0.45s_ease_forwards] hover:border-blue-100 hover:bg-blue-50/40 sm:flex-row sm:items-center sm:justify-between"
                  style={{ animationDelay: staggerDelay(index, 0.06, 0.2) }}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-100 transition-transform duration-300 hover:scale-110">
                      <UserRound size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-extrabold text-blue-950">
                        {rx.patient}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-semibold">
                        {rx.phone ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-slate-700 ring-1 ring-slate-200">
                            <Phone size={12} className="text-blue-600" />
                            <span dir="ltr" className="font-bold tabular-nums">
                              {rx.phone}
                            </span>
                          </span>
                        ) : (
                          <span className="rounded-lg bg-amber-50 px-2 py-1 text-amber-700 ring-1 ring-amber-100">
                            بدون رقم جوال
                          </span>
                        )}
                        <span className="text-slate-500">الطبيب: {rx.doctor}</span>
                      </div>
                      {rx.medications ? (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                          {rx.medications}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
                      بانتظار الصرف
                    </span>
                    <button
                      type="button"
                      onClick={() => setDispenseTarget(rx)}
                      className="workspace-btn-press inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <PackageCheck size={14} />
                      صرف الآن
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </FadeUp>

      {dispenseTarget ? (
        <DispenseVerifyModal
          prescription={dispenseTarget}
          onClose={() => setDispenseTarget(null)}
          onSuccess={(rx) => {
            showToast(`تم صرف دواء ${rx.patient || rx.patientName}`, "success");
            reload();
          }}
        />
      ) : null}
    </div>
  );
}

export default PharmacyHomePage;
