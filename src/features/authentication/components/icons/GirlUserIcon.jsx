function GirlUserIcon({ size = 18, className = "", ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 11.5c0-4 2.5-7 6-7s6 3 6 7"
        strokeWidth="2.4"
      />
      <path
        d="M5.5 12c-1.2 3.5-.8 7.5 2.5 9.5"
        strokeWidth="2.6"
      />
      <path
        d="M18.5 12c1.2 3.5.8 7.5-2.5 9.5"
        strokeWidth="2.6"
      />
      <path
        d="M15.5 5.5c2.8-.8 5 1.2 5.2 4.5c.2 2.8-1 5.2-3.2 6.8"
        strokeWidth="2.6"
      />
      <circle cx="12" cy="11" r="2.6" strokeWidth="1.9" />
      <path d="M12 13.6V15.5" />
      <path d="M9.25 20c.65-2.2 1.65-3.5 2.75-3.5s2.1 1.3 2.75 3.5" />
    </svg>
  );
}

export default GirlUserIcon;
