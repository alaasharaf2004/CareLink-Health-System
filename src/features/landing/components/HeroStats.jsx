import { useEffect, useRef, useState } from "react";

const stats = [
  { id: "support", target: null, display: "24/7", label: "دعم طبي" },
  { id: "doctors", target: 500, suffix: "+", label: "طبيب متخصص" },
  { id: "patients", target: 15, suffix: "k+", label: "مراجع سعيد" },
];

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function formatStat(stat, value) {
  if (stat.target == null) return stat.display;
  return `${value}${stat.suffix ?? ""}`;
}

function HeroStats() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [values, setValues] = useState(() =>
    Object.fromEntries(stats.map((stat) => [stat.id, 0]))
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setValues(
        Object.fromEntries(
          stats.map((stat) => [stat.id, stat.target == null ? 0 : stat.target])
        )
      );
      return undefined;
    }

    const duration = 1400;
    const start = performance.now();
    let frameId = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(progress);

      setValues(
        Object.fromEntries(
          stats.map((stat) => [
            stat.id,
            stat.target == null ? 0 : Math.round(stat.target * eased),
          ])
        )
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [started]);

  return (
    <div ref={ref} className={`landing-hero-stats ${started ? "is-active" : ""}`}>
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className="landing-hero-stat"
          style={{ "--stat-delay": `${index * 90}ms` }}
        >
          <p className="landing-hero-stat-value">
            {formatStat(stat, values[stat.id])}
          </p>
          <p className="landing-hero-stat-label">{stat.label}</p>
          <div className="landing-hero-stat-bar" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

export default HeroStats;
