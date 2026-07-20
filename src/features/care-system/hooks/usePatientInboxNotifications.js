import { useEffect, useState } from "react";

import { careSystemStore } from "../data/careSystemStore";
import {
  getBroadcastNotificationsForRole,
  pullBroadcastsForRole,
} from "../utils/broadcastNotifications";

const STORAGE_KEY = "carelink_care_system_v2";

function mapPharmacyNotifications(patientId) {
  return careSystemStore.listPatientNotifications(patientId).map((item) => ({
    id: `pnot-${item.id}`,
    type: item.type || "pharmacy",
    title: item.title,
    body: item.body,
    time: item.createdAt ? new Date(item.createdAt).toLocaleString("ar") : "",
    read: Boolean(item.read),
    to: "/patient/appointments",
    meta: { notificationId: item.id },
  }));
}

/**
 * إشعارات المريض: بث الإدارة + تنبيهات الصيدلية (جاهز / تم الصرف)
 */
export function usePatientInboxNotifications(patientId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const reload = () => {
      const broadcasts = getBroadcastNotificationsForRole("patient");
      const pharmacy = patientId ? mapPharmacyNotifications(patientId) : [];
      const merged = [...pharmacy, ...broadcasts].sort((a, b) =>
        String(b.time).localeCompare(String(a.time))
      );
      setNotifications(merged);
    };

    reload();
    pullBroadcastsForRole("patient").finally(reload);

    window.addEventListener("carelink-store-updated", reload);
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
  }, [patientId]);

  return notifications;
}
