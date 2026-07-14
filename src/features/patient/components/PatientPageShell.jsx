import { useLocation } from "react-router-dom";

function PatientPageShell({ children }) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="patient-page-enter">
      {children}
    </div>
  );
}

export default PatientPageShell;
