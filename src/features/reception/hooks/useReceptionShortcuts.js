import { useEffect } from "react";

/**
 * اختصارات لوحة المفاتيح لموظف الاستقبال.
 * Ctrl/Cmd+N → تسجيل مريض جديد
 * Ctrl/Cmd+Shift+S → ملخص اليوم
 * Ctrl/Cmd+Shift+W → شاشة الانتظار
 */
function useReceptionShortcuts({ onRegister, onDaySummary, onWaitingDisplay } = {}) {
  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key?.toLowerCase();
      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;

      const target = event.target;
      const tag = target?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable;

      if (key === "n" && !event.shiftKey) {
        if (isTyping) return;
        event.preventDefault();
        onRegister?.();
        return;
      }

      if (key === "s" && event.shiftKey) {
        event.preventDefault();
        onDaySummary?.();
        return;
      }

      if (key === "w" && event.shiftKey) {
        event.preventDefault();
        onWaitingDisplay?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onRegister, onDaySummary, onWaitingDisplay]);
}

export default useReceptionShortcuts;
