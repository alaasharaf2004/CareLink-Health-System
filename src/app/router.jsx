import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { authenticationRoutes } from "../features/authentication/routes";
import { dashboardRoutes } from "../features/dashboard/routes";
import { adminRoutes } from "../features/admin/routes";
import { patientRoutes } from "../features/patient/patientRoutes";

const router = createBrowserRouter([
  ...authenticationRoutes,
  ...dashboardRoutes,
  ...adminRoutes,
  ...patientRoutes,
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
