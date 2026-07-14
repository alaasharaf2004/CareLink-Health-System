const TONES = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    ring: "group-hover:ring-blue-100",
  },
  teal: {
    icon: "bg-emerald-50 text-emerald-600",
    ring: "group-hover:ring-emerald-100",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
    ring: "group-hover:ring-amber-100",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    ring: "group-hover:ring-violet-100",
  },
};

function PatientStatCard({ icon: Icon, label, value, tone = "blue", delay = "0s" }) {
  const styles = TONES[tone] ?? TONES.blue;

  return (
    <div
      className={`patient-card group flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 opacity-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)] ring-1 ring-transparent animate-[formFadeUp_0.6s_cubic-bezier(0.22,1,0.36,1)_forwards] ${styles.ring}`}
      style={{ animationDelay: delay }}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${styles.icon}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-extrabold tracking-tight text-blue-950">
          {value}
        </p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default PatientStatCard;
