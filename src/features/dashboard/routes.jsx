import ProtectedRoute from "../authentication/components/ProtectedRoute";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";

export const dashboardRoutes = [
  {
    path: "/doctor/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <DoctorDashboardPage />
      </ProtectedRoute>
    ),
  },
];
