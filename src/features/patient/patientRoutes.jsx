import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import PatientLayout from "./components/PatientLayout";
import PatientAppointmentDetailPage from "./pages/PatientAppointmentDetailPage";
import PatientAppointmentsPage from "./pages/PatientAppointmentsPage";
import PatientHomePage from "./pages/PatientHomePage";
import PatientMedicalProfilePage from "./pages/PatientMedicalProfilePage";
import PatientMedicalRecordsPage from "./pages/PatientMedicalRecordsPage";
import PatientSettingsPage from "./pages/PatientSettingsPage";

export const patientRoutes = [
  {
    path: "/patient",
    element: (
      <ProtectedRoute allowedRoles={["patient"]}>
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <PatientHomePage /> },
      { path: "appointments", element: <PatientAppointmentsPage /> },
      { path: "appointments/:id", element: <PatientAppointmentDetailPage /> },
      { path: "medical-records", element: <PatientMedicalRecordsPage /> },
      { path: "medical-profile", element: <PatientMedicalProfilePage /> },
      { path: "settings", element: <PatientSettingsPage /> },
    ],
  },
];
