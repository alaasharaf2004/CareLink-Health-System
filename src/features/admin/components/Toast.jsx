import { useEffect } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const VARIANTS = {
  success: { icon: CheckCircle2, className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  error: { icon: XCircle, className: "border-red-200 bg-red-50 text-red-700" },
  info: { icon: Info, className: "border-blue-200 bg-blue-50 text-blue-700" },
};

function Toast({ toast, onClose, duration = 3500 }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose, duration]);

  if (!toast) return null;

  const { icon: Icon, className } = VARIANTS[toast.variant] || VARIANTS.info;

  return (
    <div
      className="fixed left-1/2 top-5 z-[60] w-[min(92vw,420px)] -translate-x-1/2 animate-[fadeInDown_0.35s_ease_forwards]"
      dir="rtl"
      role="status"
    >
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${className}`}
      >
        <Icon size={20} className="shrink-0" />
        <p className="flex-1 text-sm font-bold">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
          aria-label="إغلاق"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default Toast;
