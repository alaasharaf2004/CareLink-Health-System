function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`w-full rounded-[32px] border border-white/80 bg-white/95 px-8 py-8 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export default AuthCard;
