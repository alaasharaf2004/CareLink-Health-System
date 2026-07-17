import { useId } from "react";

const NAVY = "#101860";
const TEAL = "#40C0A0";
const SUBTITLE_GREEN = "#34D399";

const OUTER_HEART =
  "M32 57 C32 57 8 40 8 24 C8 14 15 9 23 9 C27 9 30 13 32 17 C34 13 37 9 41 9 C49 9 56 14 56 24 C56 40 32 57 32 57 Z";

const INNER_HEART =
  "M32 46 C32 46 20 38 20 29 C20 24 24 21 28 21 C30 21 31 23 32 25 C33 23 34 21 36 21 C40 21 44 24 44 29 C44 38 32 46 32 46 Z";

const PULSE_LINE = "M18 30 H23 L25.5 24 L29 36 L32.5 26 L35.5 33 L38 30 H46";

function HeartIcon({ size = 56, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `heart-stroke-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`origin-center shrink-0 animate-[heartbeat_2.4s_ease-in-out_infinite] ${className}`}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="10"
          y1="8"
          x2="54"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={TEAL} />
          <stop offset="38%" stopColor={TEAL} />
          <stop offset="58%" stopColor={NAVY} />
          <stop offset="100%" stopColor={NAVY} />
        </linearGradient>
      </defs>

      <path
        d={OUTER_HEART}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d={INNER_HEART} fill={NAVY} />

      <path
        d={PULSE_LINE}
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="100"
        strokeDasharray="100"
        className="animate-[pulseDraw_2.8s_ease-in-out_infinite]"
      />
    </svg>
  );
}

function CareLinkLogo({
  size = 56,
  className = "",
  showText = false,
  layout = "header",
  align = "center",
  textScale = "default",
  onDark = false,
}) {
  const isForm = layout === "form";
  const isLargeText = isForm && textScale === "large";

  const alignClass =
    align === "end" ? "justify-end" : align === "start" ? "justify-start" : "justify-center";

  const titleClass = isForm
    ? isLargeText
      ? "text-lg font-extrabold leading-none"
      : "text-sm font-extrabold leading-none"
    : "text-2xl font-extrabold leading-none";

  const subtitleClass = isForm
    ? isLargeText
      ? "text-sm font-bold leading-none"
      : "text-[11px] font-bold leading-none"
    : "text-[13px] font-extrabold leading-none";

  const titleStyle = onDark
    ? { color: "#ffffff", textShadow: "0 0 18px rgba(255,255,255,0.28)" }
    : isForm
      ? { color: NAVY }
      : { color: NAVY, textShadow: "0 2px 14px rgba(255,255,255,0.45)" };

  const subtitleStyle = onDark
    ? { color: "rgba(255,255,255,0.92)" }
    : isForm
      ? { color: SUBTITLE_GREEN }
      : {
          color: SUBTITLE_GREEN,
          textShadow: "0 1px 5px rgba(0,0,0,0.45), 0 0 14px rgba(0,0,0,0.18)",
        };

  const containerClass = isForm
    ? `flex items-center gap-3 ${alignClass} animate-[logoReveal_0.8s_ease_forwards]`
    : "flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.18)]";

  const iconSize = isForm ? size : size + 4;

  return (
    <div className={`${containerClass} ${className}`}>
      <HeartIcon size={iconSize} />

      {showText && (
        <div dir="ltr" className="flex flex-col items-start gap-1 pt-0.5">
          <p className={titleClass} style={titleStyle}>
            CareLink
          </p>
          <p className={subtitleClass} style={subtitleStyle}>
            النظام الصحي
          </p>
        </div>
      )}
    </div>
  );
}

export default CareLinkLogo;
