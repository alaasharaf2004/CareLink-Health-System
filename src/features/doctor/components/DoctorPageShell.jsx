import { useLocation } from "react-router-dom";

function DoctorPageShell({ children }) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="doctor-page-enter">
      {children}
    </div>
  );
}

export default DoctorPageShell;
