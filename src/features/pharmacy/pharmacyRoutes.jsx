import { LayoutDashboard, Pill } from "lucide-react";
import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import StaffWorkspaceLayout from "../care-system/components/StaffWorkspaceLayout";
import PharmacyHomePage from "./pages/PharmacyHomePage";

const navItems = [
  { to: "/pharmacy/dashboard", label: "الوصفات", icon: Pill },
  { to: "/pharmacy/dashboard", label: "لوحة الصيدلية", icon: LayoutDashboard },
];

export const pharmacyRoutes = [
  {
    path: "/pharmacy",
    element: (
      <ProtectedRoute allowedRoles={["pharmacy"]}>
        <StaffWorkspaceLayout
          title="الصيدلية"
          navItems={navItems}
          homePath="/pharmacy/dashboard"
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <PharmacyHomePage /> },
    ],
  },
];
