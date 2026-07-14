import { useId } from "react";

const SIZE = 92;
const CENTER = SIZE / 2;
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICK_COUNT = 12;

function ResendTimer({ secondsLeft, totalSeconds, canResend, onResend }) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `timer-ring-${uid}`;
  const glowId = `timer-glow-${uid}`;

  const progress = secondsLeft / totalSeconds;
  const strokeOffset = CIRCUMFERENCE * (1 - progress);
  const orbRotation = progress * 360 - 90;

  if (canResend) {
    return (
      <div className="flex flex-col items-center gap-3 opacity-0 animate-[resendReveal_0.55s_cubic-bezier(0.22,1,0.36,1)_forwards]">
        <div className="relative flex h-[92px] w-[92px] items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-[timerCompleteBurst_0.7s_ease_forwards]" />
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
            <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke="#40c0a0"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={0}
                className="opacity-0 animate-[timerCompleteRing_0.6s_ease_0.1s_forwards]"
              />
            </g>
          </svg>
          <span className="absolute text-2xl font-bold text-[#40c0a0] opacity-0 animate-[timerCompleteCheck_0.5s_ease_0.35s_forwards]">
            ✓
          </span>
        </div>

        <button
          type="button"
          onClick={onResend}
          className="cursor-pointer rounded-full bg-blue-600 px-7 py-2.5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-200/60 active:scale-[0.98] animate-[resendPulse_2s_ease-in-out_infinite]"
        >
          إعادة إرسال الرمز
        </button>
        <p className="text-xs text-slate-400">يمكنك طلب رمز جديد الآن</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-[92px] w-[92px] items-center justify-center">
        <div className="absolute inset-1 rounded-full border border-blue-200/40 animate-[timerAuraPulse_2.5s_ease-in-out_infinite]" />

        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#40c0a0" />
              <stop offset="55%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {Array.from({ length: TICK_COUNT }, (_, index) => {
            const angle = (index / TICK_COUNT) * 2 * Math.PI - Math.PI / 2;
            const innerR = RADIUS + 5;
            const outerR = RADIUS + 9;
            const x1 = CENTER + innerR * Math.cos(angle);
            const y1 = CENTER + innerR * Math.sin(angle);
            const x2 = CENTER + outerR * Math.cos(angle);
            const y2 = CENTER + outerR * Math.sin(angle);

            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity={index % 3 === 0 ? 0.9 : 0.45}
              />
            );
          })}

          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
          />

          <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
              filter={`url(#${glowId})`}
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </g>
        </svg>

        <div
          className="pointer-events-none absolute inset-0 transition-transform duration-1000 ease-linear"
          style={{ transform: `rotate(${orbRotation}deg)` }}
        >
          <div className="absolute left-1/2 top-[7px] -translate-x-1/2">
            <div className="h-3 w-3 rounded-full bg-[#40c0a0] shadow-[0_0_14px_rgba(64,192,160,0.85)] animate-[timerOrbPulse_1.5s_ease-in-out_infinite]" />
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <span
            key={secondsLeft}
            className="text-2xl font-extrabold tabular-nums text-blue-600 animate-[timerTick_0.45s_cubic-bezier(0.22,1,0.36,1)_forwards]"
          >
            {secondsLeft}
          </span>
          <span className="text-[10px] font-bold text-slate-400">ثانية</span>
        </div>
      </div>

      <p className="text-sm text-slate-500">إعادة الإرسال خلال قليل</p>
    </div>
  );
}

export default ResendTimer;
