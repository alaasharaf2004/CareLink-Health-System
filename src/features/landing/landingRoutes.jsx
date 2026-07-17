import LandingLayout from "./components/LandingLayout";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import DoctorsPage from "./pages/DoctorsPage";
import FaqPage from "./pages/FaqPage";
import LandingPage from "./pages/LandingPage";
import OffersPage from "./pages/OffersPage";

export const landingRoutes = [
  {
    element: <LandingLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/doctors", element: <DoctorsPage /> },
      { path: "/blog", element: <BlogPage /> },
      { path: "/faq", element: <FaqPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/offers", element: <OffersPage /> },
    ],
  },
];
