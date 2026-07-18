import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { authenticationRoutes } from "../features/authentication/routes";
import { adminRoutes } from "../features/admin/routes";
import { doctorRoutes } from "../features/doctor/doctorRoutes";
import { laboratoryRoutes } from "../features/laboratory/laboratoryRoutes";
import { landingRoutes } from "../features/landing/landingRoutes";
import { patientRoutes } from "../features/patient/patientRoutes";
import { pharmacyRoutes } from "../features/pharmacy/pharmacyRoutes";
import { receptionRoutes } from "../features/reception/receptionRoutes";

const router = createBrowserRouter([
  ...landingRoutes,
  ...authenticationRoutes,
  ...doctorRoutes,
  ...adminRoutes,
  ...patientRoutes,
  ...receptionRoutes,
  ...laboratoryRoutes,
  ...pharmacyRoutes,
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
