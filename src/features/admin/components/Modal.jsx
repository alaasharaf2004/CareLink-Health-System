import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const BACKDROP_STYLES = {
  dark: "bg-[#0f172a]/60 backdrop-blur-xl",
  frost: "bg-slate-500/35 backdrop-blur-2xl",
};

function Modal({
  title,
  onClose,
  children,
  maxWidth = "max-w-lg",
  backdrop = "dark",
  footer,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const isFrost = backdrop === "frost";

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className={`absolute inset-0 cursor-default border-0 ${BACKDROP_STYLES[backdrop] ?? BACKDROP_STYLES.dark}`}
        onClick={onClose}
        aria-label="إغلاق"
      />

      <div
        className={`relative z-10 flex w-full ${maxWidth} flex-col overflow-hidden rounded-3xl border bg-white animate-[authCardReveal_0.35s_cubic-bezier(0.22,1,0.36,1)_forwards] ${
          isFrost
            ? "border-slate-300 shadow-[0_24px_70px_rgba(15,23,42,0.28)]"
            : "border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.3)]"
        }`}
      >
        <div
          className={`shrink-0 border-b px-5 py-4 sm:px-6 ${
            isFrost
              ? "border-slate-200 bg-gradient-to-l from-blue-50 via-white to-emerald-50/60"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-extrabold text-[#101860] sm:text-xl">
                {title}
              </h2>
              {isFrost && (
                <p className="mt-1 text-xs font-medium text-slate-500">
                  اختر الطبيب والموعد المناسب لك
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              aria-label="إغلاق النافذة"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ارتفاع ثابت للمحتوى حتى يبقى الهيدر والفوتر ظاهرين دائماً */}
        <div className="max-h-[min(52vh,480px)] overflow-y-auto overscroll-contain px-5 py-4 sm:max-h-[min(58vh,560px)] sm:px-6 sm:py-5">
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t-2 border-slate-200 bg-white px-5 py-3.5 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default Modal;
