import { useCallback, useState } from "react";

/**
 * إدارة حالة رسالة منبثقة (toast) واحدة في الصفحة.
 * showToast(message, variant) لعرض الرسالة، hideToast لإخفائها.
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant, id: Date.now() });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast };
}
