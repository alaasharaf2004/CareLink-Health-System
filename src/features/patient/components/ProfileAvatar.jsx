const SIZE_MAP = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

function ProfileAvatar({
  src,
  name,
  size = "md",
  className = "",
  ring = false,
  animate = false,
}) {
  const initial = (name || "?").replace(/د\.\s*/, "").charAt(0);
  const sizeClass = SIZE_MAP[size] ?? SIZE_MAP.md;
  const ringClass = ring ? "ring-2 ring-white ring-offset-1" : "";
  const animClass = animate
    ? "opacity-0 animate-[patientScaleIn_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]"
    : "";

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `صورة ${name}` : "صورة الملف الشخصي"}
        className={`${sizeClass} shrink-0 rounded-full object-cover ${ringClass} ${animClass} ${className}`}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#101860] via-[#1a2878] to-blue-600 font-extrabold text-white ${ringClass} ${animClass} ${className}`}
      aria-hidden={!name}
    >
      {initial}
    </div>
  );
}

export default ProfileAvatar;
