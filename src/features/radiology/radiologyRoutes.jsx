import { LayoutDashboard, Scan } from "lucide-react";
import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import StaffWorkspaceLayout from "../care-system/components/StaffWorkspaceLayout";
import RadiologyHomePage from "./pages/RadiologyHomePage";

const navItems = [
  { to: "/radiology/dashboard", label: "لوحة الأشعة", icon: LayoutDashboard, end: true },
  { to: "/radiology/dashboard", label: "طلبات التصوير", icon: Scan },
];

export const radiologyRoutes = [
  {
    path: "/radiology",
    element: (
      <ProtectedRoute allowedRoles={["radiology"]}>
        <StaffWorkspaceLayout
          title="لوحة الأشعة"
          roleLabel="فني الأشعة"
          roleKey="radiology"
          navItems={navItems}
          homePath="/radiology/dashboard"
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <RadiologyHomePage /> },
    ],
  },
];
