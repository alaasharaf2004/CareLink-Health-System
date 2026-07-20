import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";

import apiClient from "../../../lib/api/client";
import { careSystemStore } from "../../care-system/data/careSystemStore";

const ALLOWED_ROLES = new Set(["doctor", "patient"]);
const STORAGE_KEY = "carelink_care_system_v2";

function normalizeMessages(list = []) {
  return list
    .map((item) => ({
      id: item.id,
      appointmentId: item.appointment_id ?? item.appointmentId,
      senderRole: item.sender_role ?? item.senderRole ?? item.role,
      senderName: item.sender_name ?? item.senderName ?? "",
      body: item.body ?? item.message ?? item.content ?? "",
      createdAt: item.created_at ?? item.createdAt ?? "",
    }))
    .filter(
      (item) =>
        item.body &&
        ALLOWED_ROLES.has(item.senderRole) &&
        item.appointmentId != null
    )
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

/**
 * دردشة الموعد — بين الطبيب والمريض فقط.
 * التخزين المحلي هو مصدر المزامنة بينهما في نفس المتصفح.
 */
function AppointmentChatBox({
  appointmentId,
  role,
  peerName = role === "doctor" ? "المريض" : "الطبيب",
  selfName = role === "doctor" ? "الطبيب" : "المريض",
  className = "",
}) {
  const isAllowedRole = ALLOWED_ROLES.has(role);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const prevCountRef = useRef(0);
  const apiBase =
    role === "doctor"
      ? `/doctor/appointments/${appointmentId}/messages`
      : `/patient/appointments/${appointmentId}/messages`;

  /** تمرير داخل صندوق الدردشة فقط — بدون تحريك صفحة الموعد */
  const scrollListToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  const loadLocal = () => {
    if (!appointmentId) return;
    const next = normalizeMessages(careSystemStore.listChatMessages(appointmentId));
    setMessages((prev) => {
      if (
        prev.length === next.length &&
        prev.every((msg, index) => msg.id === next[index]?.id && msg.body === next[index]?.body)
      ) {
        return prev;
      }
      return next;
    });
  };

  const syncFromLocal = () => {
    loadLocal();
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isAllowedRole || !appointmentId) {
      setIsLoading(false);
      setMessages([]);
      return undefined;
    }

    prevCountRef.current = 0;
    syncFromLocal();

    const timer = window.setInterval(() => {
      syncFromLocal();
    }, 1500);

    const onStore = () => syncFromLocal();
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) syncFromLocal();
    };

    window.addEventListener("carelink-store-updated", onStore);
    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("carelink-store-updated", onStore);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, role]);

  useEffect(() => {
    // نمرّر داخل الصندوق فقط عند وصول رسائل جديدة (مو عند فتح الصفحة)
    if (messages.length > prevCountRef.current) {
      scrollListToBottom();
    }
    prevCountRef.current = messages.length;
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    setError("");

    if (!isAllowedRole) {
      setError("الدردشة متاحة للطبيب والمريض فقط");
      return;
    }

    const body = draft.trim();
    if (!body || isSending || !appointmentId) return;

    setIsSending(true);
    try {
      // دائماً نحفظ محلياً أولاً — هذا ما يضمن وصول الرسالة للطرف الآخر
      careSystemStore.sendChatMessage({
        appointmentId,
        senderRole: role,
        senderName: selfName,
        body,
      });
      setDraft("");
      syncFromLocal();

      // مزامنة اختيارية مع الخادم إن وُجد
      try {
        await apiClient.post(apiBase, {
          body,
          message: body,
          sender_role: role,
        });
      } catch {
        // تجاهل فشل الـ API؛ الرسالة محفوظة محلياً ومرئية للطرفين
      }
    } catch (err) {
      setError(err.message || "تعذر إرسال الرسالة");
    } finally {
      setIsSending(false);
    }
  };

  if (!isAllowedRole) {
    return (
      <section
        className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-center"
        dir="rtl"
      >
        <p className="text-sm font-bold text-amber-800">
          الدردشة متاحة بين الطبيب والمريض فقط
        </p>
      </section>
    );
  }

  return (
    <section
      className={`flex h-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
      dir="rtl"
    >
      <header className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-l from-blue-50 to-white px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
          <MessageCircle size={18} />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold text-blue-950">محادثة الموعد</h2>
          <p className="truncate text-[11px] font-semibold text-slate-500">
            بينك وبين {peerName} فقط — الرسائل مرتبطة بهذا الموعد
          </p>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50/60 px-3 py-3"
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <p className="text-sm font-bold text-slate-500">لا رسائل بعد</p>
            <p className="mt-1 text-xs text-slate-400">
              ابدأ المحادثة — الرسالة ستظهر فوراً للطرف الآخر.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const mine = msg.senderRole === role;
            return (
              <div
                key={msg.id}
                className={`flex ${mine ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                    mine
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <p
                    className={`mb-1 text-[10px] font-bold ${
                      mine ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {mine ? "أنت" : msg.senderName || peerName}
                  </p>
                  <p className="whitespace-pre-wrap leading-6">{msg.body}</p>
                  {msg.createdAt && (
                    <p
                      className={`mt-1 text-[10px] ${
                        mine ? "text-blue-100/80" : "text-slate-400"
                      }`}
                      dir="ltr"
                    >
                      {new Date(msg.createdAt).toLocaleTimeString("ar", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={sendMessage}
        className="flex flex-col gap-2 border-t border-slate-100 bg-white p-3"
      >
        {error ? (
          <p className="text-xs font-bold text-red-600">{error}</p>
        ) : null}
        <div className="flex items-center gap-2">
          <input
            className="h-11 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            placeholder={`رسالة إلى ${peerName}...`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={1000}
            aria-label="نص الرسالة"
          />
          <button
            type="submit"
            disabled={!draft.trim() || isSending}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-50"
            aria-label="إرسال"
          >
            {isSending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AppointmentChatBox;
