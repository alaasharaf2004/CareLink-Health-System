import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../constants/authRoutes";

function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const { isAuthenticated, role, profile } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (profile?.mustChangePassword && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  return children;
}

export default ProtectedRoute;
