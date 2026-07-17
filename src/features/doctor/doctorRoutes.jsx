import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import DoctorLayout from "./components/DoctorLayout";
import DoctorAppointmentDetailPage from "./pages/DoctorAppointmentDetailPage";
import DoctorAppointmentsPage from "./pages/DoctorAppointmentsPage";
import DoctorHomePage from "./pages/DoctorHomePage";
import DoctorMedicalRecordsPage from "./pages/DoctorMedicalRecordsPage";
import DoctorPatientDetailPage from "./pages/DoctorPatientDetailPage";
import DoctorPatientsPage from "./pages/DoctorPatientsPage";
import DoctorSettingsPage from "./pages/DoctorSettingsPage";

export const doctorRoutes = [
  {
    path: "/doctor",
    element: (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <DoctorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DoctorHomePage /> },
      { path: "appointments", element: <DoctorAppointmentsPage /> },
      { path: "appointments/:id", element: <DoctorAppointmentDetailPage /> },
      { path: "medical-records", element: <DoctorMedicalRecordsPage /> },
      { path: "patients", element: <DoctorPatientsPage /> },
      { path: "patients/:id", element: <DoctorPatientDetailPage /> },
      { path: "settings", element: <DoctorSettingsPage /> },
    ],
  },
];
