import { CalendarDays, LayoutDashboard } from "lucide-react";
import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import StaffWorkspaceLayout from "../care-system/components/StaffWorkspaceLayout";
import ReceptionHomePage from "./pages/ReceptionHomePage";

const navItems = [
  { to: "/reception/dashboard", label: "لوحة الاستقبال", icon: LayoutDashboard },
  { to: "/reception/dashboard", label: "المواعيد والمرضى", icon: CalendarDays },
];

export const receptionRoutes = [
  {
    path: "/reception",
    element: (
      <ProtectedRoute allowedRoles={["reception"]}>
        <StaffWorkspaceLayout
          title="الاستقبال"
          navItems={navItems}
          homePath="/reception/dashboard"
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <ReceptionHomePage /> },
    ],
  },
];
