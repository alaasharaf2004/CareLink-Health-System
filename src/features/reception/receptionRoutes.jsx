import {
  CalendarDays,
  LayoutDashboard,
  MonitorPlay,
  Users,
} from "lucide-react";
import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import StaffWorkspaceLayout from "../care-system/components/StaffWorkspaceLayout";
import ReceptionHomePage from "./pages/ReceptionHomePage";
import ReceptionPatientsPage from "./pages/ReceptionPatientsPage";
import ReceptionSchedulePage from "./pages/ReceptionSchedulePage";
import ReceptionWaitingDisplayPage from "./pages/ReceptionWaitingDisplayPage";

const navItems = [
  { to: "/reception/dashboard", label: "لوحة اليوم", icon: LayoutDashboard, end: true },
  { to: "/reception/schedule", label: "مواعيد الأطباء", icon: CalendarDays },
  { to: "/reception/patients", label: "ملف المرضى", icon: Users },
  { to: "/reception/waiting-display", label: "شاشة الانتظار", icon: MonitorPlay },
];

export const receptionRoutes = [
  {
    path: "/reception/waiting-display",
    element: (
      <ProtectedRoute allowedRoles={["reception", "admin"]}>
        <ReceptionWaitingDisplayPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reception",
    element: (
      <ProtectedRoute allowedRoles={["reception"]}>
        <StaffWorkspaceLayout
          title="لوحة الاستقبال"
          roleLabel="موظف استقبال"
          roleKey="reception"
          navItems={navItems}
          homePath="/reception/dashboard"
        />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <ReceptionHomePage /> },
      { path: "schedule", element: <ReceptionSchedulePage /> },
      { path: "patients", element: <ReceptionPatientsPage /> },
    ],
  },
];
