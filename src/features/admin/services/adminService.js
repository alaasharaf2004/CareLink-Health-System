import apiClient from "../../../lib/api/client";
import {
  getAllAdmins as fetchAllAdmins,
  getAllPatients as fetchAllPatients,
  loginAdmin,
} from "../../authentication/services/authService";

/**
 * تسجيل دخول الإدارة
 * POST /api/auth/admin/login
 */
export { loginAdmin };

/**
 * قائمة الأدمن
 * GET /api/auth/admin/list
 */
export async function getAllAdmins() {
  return fetchAllAdmins();
}

/**
 * قائمة المرضى للإدارة
 * GET /api/auth/admin/patients
 */
export async function getAllPatients() {
  return fetchAllPatients();
}

/**
 * طلبات عامة تحت بادئة الإدارة إن وُجدت لاحقاً في الباك إند
 * مثال: GET /api/admin/...
 */
export async function adminGet(path) {
  const response = await apiClient.get(`/admin${path}`);
  return response.data;
}

export async function adminPost(path, data) {
  const response = await apiClient.post(`/admin${path}`, data);
  return response.data;
}
