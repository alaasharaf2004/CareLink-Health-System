import apiClient from "../../../lib/api/client";
import { careSystemStore } from "../data/careSystemStore";

/**
 * ربط دور المستخدم بقيم target القادمة من الباك / الأدمن
 * doctors → يظهر عند الطبيب فقط
 * all → يظهر عند كل الأدوار
 */
export const ROLE_TARGET_MAP = {
  patient: ["all", "patients", "patient"],
  doctor: ["all", "doctors", "doctor"],
  pharmacy: ["all", "pharmacists", "pharmacist", "pharmacy"],
  laboratory: ["all", "laboratory", "lab"],
  radiology: ["all", "radiology"],
  reception: ["all", "reception"],
  admin: ["all"],
};

const ROLE_API_PATHS = {
  patient: ["/patient/broadcasts", "/broadcasts"],
  doctor: ["/doctor/broadcasts", "/broadcasts"],
  pharmacy: ["/pharmacy/broadcasts", "/broadcasts"],
  laboratory: ["/laboratory/broadcasts", "/broadcasts"],
  radiology: ["/radiology/broadcasts", "/broadcasts"],
  reception: ["/reception/broadcasts", "/broadcasts"],
  admin: ["/admin/broadcasts"],
};

/**
 * هل هذا الإعلان مخصّص لهذا الدور؟
 */
export function isBroadcastForRole(broadcast, role) {
  const target = String(broadcast?.target || "all").toLowerCase();
  const allowed = ROLE_TARGET_MAP[role] || ["all"];
  return allowed.includes(target);
}

/**
 * تحويل إعلانات البث إلى شكل NotificationsBell حسب دور المستخدم
 */
export function getBroadcastNotificationsForRole(role) {
  return careSystemStore
    .listBroadcasts()
    .filter((item) => isBroadcastForRole(item, role))
    .map((item) => {
      const created = item.created_at || item.createdAt;
      const target = item.target || "all";
      return {
        id: `broadcast-${item.id}`,
        type: "broadcast",
        title:
          target === "all" ? "إعلان عام من الإدارة" : "إعلان من الإدارة",
        body: item.message,
        time: created ? new Date(created).toLocaleString("ar") : "الآن",
        read: false,
        to: null,
        meta: { target, broadcastId: item.id },
      };
    });
}

/**
 * سحب الإعلانات من الـ API (إن وُجدت) ودمجها محلياً لتظهر في الإشعارات
 */
export async function pullBroadcastsForRole(role) {
  const paths = ROLE_API_PATHS[role] || ["/broadcasts"];
  for (const path of paths) {
    try {
      const response = await apiClient.get(path);
      const list = response.data?.data ?? response.data ?? [];
      if (Array.isArray(list) && list.length) {
        careSystemStore.syncBroadcasts(list);
        return list;
      }
    } catch {
      // جرّب المسار التالي
    }
  }
  return null;
}
