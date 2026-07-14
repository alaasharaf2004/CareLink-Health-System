import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../constants/authRoutes";

function GuestRoute({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  return children;
}

export default GuestRoute;
