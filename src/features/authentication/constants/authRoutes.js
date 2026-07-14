export const DASHBOARD_BY_ROLE = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/doctors",
};

export function getDashboardPath(role) {
  return DASHBOARD_BY_ROLE[role] ?? "/";
}
