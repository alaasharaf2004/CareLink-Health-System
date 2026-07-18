import { Navigate } from "react-router-dom";

import AuthPageTransition from "./components/AuthPageTransition";
import GuestRoute from "./components/GuestRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

export const authenticationRoutes = [
  {
    element: <AuthPageTransition />,
    children: [
      {
        path: "/login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "/staff/login",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/admin/login",
        element: <Navigate to="/login" replace state={{ authRole: "admin" }} />,
      },
      {
        path: "/register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        ),
      },
      {
        path: "/verify-code",
        element: <VerifyCodePage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },
];
