import { useEffect, useState } from "react";

import {
  getBroadcastNotificationsForRole,
  pullBroadcastsForRole,
} from "../utils/broadcastNotifications";

const STORAGE_KEY = "carelink_care_system_v2";

/**
 * إشعارات البث الحية حسب دور المستخدم:
 * - doctors → للطبيب فقط
 * - all → لكل الأدوار في نفس الوقت
 */
export function useBroadcastNotifications(role) {
  const [notifications, setNotifications] = useState(() =>
    getBroadcastNotificationsForRole(role)
  );

  useEffect(() => {
    if (!role) {
      setNotifications([]);
      return undefined;
    }

    const reload = () => {
      setNotifications(getBroadcastNotificationsForRole(role));
    };

    reload();
    pullBroadcastsForRole(role).finally(reload);

    // تحديث فوري في نفس التبويب
    window.addEventListener("carelink-store-updated", reload);

    // تحديث بين التبويبات (أدمن يرسل ← طبيب يشوف)
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) reload();
    };
    window.addEventListener("storage", onStorage);

    let channel;
    try {
      channel = new BroadcastChannel("carelink-store");
      channel.onmessage = () => reload();
    } catch {
      channel = null;
    }

    // احتياطي: تحديث دوري كل ثانيتين
    const timer = window.setInterval(reload, 2000);

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
  }, [role]);

  return notifications;
}
