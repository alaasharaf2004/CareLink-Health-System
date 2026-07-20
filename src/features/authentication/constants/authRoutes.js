export const DASHBOARD_BY_ROLE = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/staff",
  reception: "/reception/dashboard",
  laboratory: "/laboratory/dashboard",
  pharmacy: "/pharmacy/dashboard",
  radiology: "/radiology/dashboard",
};

export function getDashboardPath(role) {
  return DASHBOARD_BY_ROLE[role] ?? "/";
}
