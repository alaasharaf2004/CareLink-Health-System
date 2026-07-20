import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, CheckCheck, FileHeart, X } from "lucide-react";

const ICON_MAP = {
  appointment: CalendarDays,
  record: FileHeart,
  broadcast: Bell,
  pharmacy: Bell,
  default: Bell,
};

/**
 * قائمة إشعارات تفاعلية للهيدر
 * @param {{ notifications: Array, onMarkAllRead?: Function, onMarkRead?: Function }} props
 */
function NotificationsBell({ notifications: initialNotifications = [] }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const signature = initialNotifications.map((item) => item.id).join("|");

  useEffect(() => {
    setItems((current) => {
      const readIds = new Set(current.filter((item) => item.read).map((item) => item.id));
      return initialNotifications.map((item) => ({
        ...item,
        read: readIds.has(item.id) ? true : Boolean(item.read),
      }));
    });
    // نعتمد signature حتى لا نمسح حالة "مقروء" مع كل render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointer = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const unreadCount = items.filter((item) => !item.read).length;

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, read: true })));
  };

  const handleItemClick = (item) => {
    setItems((current) =>
      current.map((row) =>
        row.id === item.id ? { ...row, read: true } : row
      )
    );
    setIsOpen(false);
    if (item.to) navigate(item.to);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors ${
          isOpen
            ? "bg-blue-50 text-blue-700"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        }`}
        aria-label="الإشعارات"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute end-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-extrabold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-12 z-50 w-[min(100vw-2rem,22rem)] origin-top-left overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.15)] opacity-0 animate-[formFadeUp_0.28s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          role="dialog"
          aria-label="قائمة الإشعارات"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-extrabold text-[#101860]">الإشعارات</p>
              <p className="text-xs text-slate-400">
                {unreadCount > 0
                  ? `${unreadCount} غير مقروءة`
                  : "لا توجد إشعارات جديدة"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold text-blue-600 transition-colors hover:bg-blue-50"
                  title="تعيين الكل كمقروء"
                >
                  <CheckCheck size={14} />
                  قراءة الكل
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Bell size={28} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-400">
                  لا توجد إشعارات بعد
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((item) => {
                  const Icon = ICON_MAP[item.type] ?? ICON_MAP.default;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className={`flex w-full cursor-pointer items-start gap-3 px-4 py-3.5 text-right transition-colors hover:bg-slate-50 ${
                          item.read ? "bg-white" : "bg-blue-50/50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            item.read
                              ? "bg-slate-100 text-slate-500"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm leading-5 ${
                                item.read
                                  ? "font-semibold text-slate-700"
                                  : "font-extrabold text-[#101860]"
                              }`}
                            >
                              {item.title}
                            </p>
                            {!item.read && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {item.body}
                          </p>
                          <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                            {item.time}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsBell;
