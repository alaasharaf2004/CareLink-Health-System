import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AdminProfilePage from "./pages/AdminProfilePage";
import AdsPage from "./pages/AdsPage";
import AppointmentsMonitorPage from "./pages/AppointmentsMonitorPage";
import ArticlesPage from "./pages/ArticlesPage";
import DoctorRequestsPage from "./pages/DoctorRequestsPage";
import PatientsMonitorPage from "./pages/PatientsMonitorPage";
import PostsPage from "./pages/PostsPage";
import SiteSettingsPage from "./pages/SiteSettingsPage";
import StaffPage from "./pages/StaffPage";
import BroadcastsPage from "./pages/BroadcastsPage";
import NewDoctorPage from "./pages/AddNewDoctor.tsx";

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="staff" replace /> },
      { path: "dashboard", element: <Navigate to="/admin/staff" replace /> },
      { path: "staff", element: <StaffPage /> },
      { path: "doctors", element: <DoctorRequestsPage /> },
      { path: "doctors/new", element: <NewDoctorPage /> },
      { path: "articles", element: <ArticlesPage /> },
      { path: "ads", element: <AdsPage /> },
      { path: "broadcasts", element: <BroadcastsPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "patients", element: <PatientsMonitorPage /> },
      { path: "appointments", element: <AppointmentsMonitorPage /> },
      { path: "settings", element: <SiteSettingsPage /> },
      { path: "profile", element: <AdminProfilePage /> },
    ],
  },
];
