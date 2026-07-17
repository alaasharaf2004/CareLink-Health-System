import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { authenticationRoutes } from "../features/authentication/routes";
import { adminRoutes } from "../features/admin/routes";
import { doctorRoutes } from "../features/doctor/doctorRoutes";
import { landingRoutes } from "../features/landing/landingRoutes";
import { patientRoutes } from "../features/patient/patientRoutes";

const router = createBrowserRouter([
  ...landingRoutes,
  ...authenticationRoutes,
  ...doctorRoutes,
  ...adminRoutes,
  ...patientRoutes,
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
