import { Outlet, useLocation } from "react-router-dom";

function AuthPageTransition() {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="auth-page-enter min-h-screen">
      <Outlet />
    </div>
  );
}

export default AuthPageTransition;
