import { useLocation } from "react-router-dom";

function StaffPageShell({ children }) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="staff-page-enter">
      {children}
    </div>
  );
}

export default StaffPageShell;
