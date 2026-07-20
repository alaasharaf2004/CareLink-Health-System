import { useEffect, useMemo, useState } from "react";

import CareLinkLogo from "../../../components/CareLinkLogo";
import {
  APPOINTMENT_STATUS_LABELS,
  careSystemStore,
} from "../../care-system/data/careSystemStore";
import { todayIso } from "../utils/receptionHelpers";

function formatArabicDate(iso) {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("ar", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function ReceptionWaitingDisplayPage() {
  const [queue, setQueue] = useState([]);
  const [now, setNow] = useState(new Date());
  const [flashKey, setFlashKey] = useState(0);
  const today = todayIso();

  const reload = () => setQueue(careSystemStore.getWaitingRoomQueue(today));

  useEffect(() => {
    reload();
    const onStore = () => reload();
    window.addEventListener("carelink-store-updated", onStore);
    const poll = window.setInterval(reload, 3000);
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.removeEventListener("carelink-store-updated", onStore);
      window.clearInterval(poll);
      window.clearInterval(clock);
    };
  }, [today]);

  const current = useMemo(
    () =>
      queue.find((item) => item.status === "with_doctor") ||
      queue.find((item) => item.status === "checked_in"),
    [queue]
  );

  const nextList = useMemo(
    () =>
      queue
        .filter((item) => item.id !== current?.id)
        .filter((item) => item.status === "checked_in" || item.status === "scheduled")
        .slice(0, 5),
    [queue, current]
  );

  useEffect(() => {
    if (current?.id) setFlashKey((n) => n + 1);
  }, [current?.id]);

  const clock = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="waiting-board min-h-screen" dir="rtl">
      <div className="waiting-board-bg" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-screen max-w-[90rem] flex-col px-6 py-6 sm:px-10 sm:py-8 lg:px-14 lg:py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <CareLinkLogo size={52} showText layout="form" align="start" textScale="large" />
          <div className="text-left" dir="ltr">
            <p className="waiting-board-clock tabular-nums">{clock}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500 sm:text-base">
              {formatArabicDate(today)}
            </p>
          </div>
        </header>

        <main className="mt-8 grid flex-1 grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-8">
          <section
            key={flashKey}
            className="waiting-board-now waiting-board-now-enter lg:col-span-8"
          >
            <p className="waiting-board-kicker">يُدعى الآن إلى العيادة</p>

            {current ? (
              <div className="mt-6 flex flex-col items-start gap-5 sm:mt-8 sm:gap-6">
                <div className="flex items-end gap-4 sm:gap-6">
                  <span className="waiting-board-number tabular-nums">
                    {String(current.queueNumber).padStart(2, "0")}
                  </span>
                  <span className="waiting-board-number-label">رقم الدور</span>
                </div>

                <h1 className="waiting-board-name">{current.patient}</h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base font-bold text-slate-600 sm:text-lg">
                  <span>{current.doctor}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#40c0a0]" aria-hidden="true" />
                  <span className="tabular-nums" dir="ltr">
                    {current.time}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden="true" />
                  <span className="font-extrabold text-[#101860]">
                    {APPOINTMENT_STATUS_LABELS[current.status] || current.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-10">
                <p className="text-3xl font-extrabold text-slate-400 sm:text-4xl">
                  لا يوجد مريض يُدعى حالياً
                </p>
                <p className="mt-3 max-w-md text-base font-semibold leading-7 text-slate-400">
                  عند تسجيل الحضور أو التحويل للطبيب سيظهر الاسم هنا بوضوح.
                </p>
              </div>
            )}
          </section>

          <aside className="waiting-board-side lg:col-span-4">
            <h2 className="waiting-board-side-title">التالي</h2>

            {nextList.length === 0 ? (
              <p className="mt-6 text-base font-bold text-slate-400">قائمة الانتظار فارغة</p>
            ) : (
              <ol className="mt-5 space-y-3">
                {nextList.map((item, index) => (
                  <li key={item.id} className="waiting-board-row">
                    <span className="waiting-board-row-num tabular-nums">
                      {String(item.queueNumber).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-extrabold text-[#101860]">
                        {item.patient}
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-slate-500">
                        {item.doctor}
                        {index === 0 && item.status === "checked_in" ? " · جاهز" : ""}
                      </p>
                    </div>
                    <span className="shrink-0 tabular-nums text-sm font-bold text-slate-400" dir="ltr">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ol>
            )}

            <p className="waiting-board-footer-note">
              يرجى التوجه للعيادة عند سماع/ظهور اسمكم
            </p>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default ReceptionWaitingDisplayPage;
