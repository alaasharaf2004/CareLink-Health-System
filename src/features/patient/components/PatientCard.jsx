import { Link } from "react-router-dom";

import { staggerDelay } from "../utils/staggerDelay";

function PatientCard({
  children,
  className = "",
  index = 0,
  delay,
  to,
  onClick,
  as,
}) {
  const animationDelay = delay ?? staggerDelay(index, 0.06, 0.1);
  const baseClass = `patient-card rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] opacity-0 animate-[formFadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards] ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={baseClass}
        style={{ animationDelay }}
      >
        {children}
      </Link>
    );
  }

  const Tag = as ?? (onClick ? "button" : "div");

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={baseClass}
      style={{ animationDelay }}
    >
      {children}
    </Tag>
  );
}

export default PatientCard;
