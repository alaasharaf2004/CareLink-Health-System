const TONES = {
  blue: "bg-blue-50 text-blue-600",
  teal: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
};

function StatCard({ icon: Icon, label, value, tone = "blue", delay = "0s" }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 opacity-0 shadow-sm animate-[formFadeUp_0.6s_ease_forwards]"
      style={{ animationDelay: delay }}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-blue-950">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
