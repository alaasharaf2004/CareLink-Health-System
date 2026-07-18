import { FlaskConical, LayoutDashboard } from "lucide-react";
import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import StaffWorkspaceLayout from "../care-system/components/StaffWorkspaceLayout";
import LaboratoryHomePage from "./pages/LaboratoryHomePage";

const navItems = [
  { to: "/laboratory/dashboard", label: "طلبات التحاليل", icon: FlaskConical },
  { to: "/laboratory/dashboard", label: "لوحة المختبر", icon: LayoutDashboard },
];

export const laboratoryRoutes = [
  {
    path: "/laboratory",
    element: (
      <ProtectedRoute allowedRoles={["laboratory"]}>
        <StaffWorkspaceLayout
          title="المختبر"
          navItems={navItems}
          homePath="/laboratory/dashboard"
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <LaboratoryHomePage /> },
    ],
  },
];
