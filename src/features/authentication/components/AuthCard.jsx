function AuthCard({ children, className = "", elevated = true }) {
  return (
    <div
      className={[
        "auth-form-card relative w-full overflow-hidden rounded-[28px] border border-white/80 bg-white/95 px-7 py-7 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:px-8 sm:py-8",
        elevated ? "is-elevated" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {elevated && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#40C0A0]/12 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-12 h-44 w-44 rounded-full bg-[#101860]/10 blur-3xl"
          />
        </>
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

export default AuthCard;
