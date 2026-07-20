import { LayoutDashboard, ClipboardList, Package, Pill } from "lucide-react";
import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import StaffWorkspaceLayout from "../care-system/components/StaffWorkspaceLayout";
import PharmacyHistoryPage from "./pages/PharmacyHistoryPage";
import PharmacyHomePage from "./pages/PharmacyHomePage";
import PharmacyInventoryPage from "./pages/PharmacyInventoryPage";
import PharmacyPrescriptionsPage from "./pages/PharmacyPrescriptionsPage";

const navItems = [
  { to: "/pharmacy/dashboard", label: "لوحة الصيدلية", icon: LayoutDashboard, end: true },
  { to: "/pharmacy/prescriptions", label: "الوصفات", icon: Pill },
  { to: "/pharmacy/inventory", label: "المخزون", icon: Package },
  { to: "/pharmacy/history", label: "سجل الصرف", icon: ClipboardList },
];

export const pharmacyRoutes = [
  {
    path: "/pharmacy",
    element: (
      <ProtectedRoute allowedRoles={["pharmacy"]}>
        <StaffWorkspaceLayout
          title="لوحة الصيدلية"
          roleLabel="صيدلي"
          roleKey="pharmacy"
          navItems={navItems}
          homePath="/pharmacy/dashboard"
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <PharmacyHomePage /> },
      { path: "prescriptions", element: <PharmacyPrescriptionsPage /> },
      { path: "inventory", element: <PharmacyInventoryPage /> },
      { path: "history", element: <PharmacyHistoryPage /> },
    ],
  },
];
