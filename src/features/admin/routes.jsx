import { Navigate } from "react-router-dom";

import ProtectedRoute from "../authentication/components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AdminProfilePage from "./pages/AdminProfilePage";
import AdsPage from "./pages/AdsPage";
import DoctorRequestsPage from "./pages/DoctorRequestsPage";
import PostsPage from "./pages/PostsPage";

export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="doctors" replace /> },
      { path: "dashboard", element: <Navigate to="/admin/doctors" replace /> },
      { path: "doctors", element: <DoctorRequestsPage /> },
      { path: "ads", element: <AdsPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "profile", element: <AdminProfilePage /> },
    ],
  },
];
