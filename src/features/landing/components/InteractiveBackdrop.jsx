import { useEffect, useRef } from "react";

const NAVY_RGB = [16, 24, 96];
const TEAL_RGB = [64, 192, 160];

/** Exact pulse path from CareLinkLogo (viewBox 0–64) */
const LOGO_PULSE = [
  [18, 30],
  [23, 30],
  [25.5, 24],
  [29, 36],
  [32.5, 26],
  [35.5, 33],
  [38, 30],
  [46, 30],
];

const ICON_KINDS = [
  "pill",
  "capsule",
  "bottle",
  "syringe",
  "scalpel",
  "xray",
  "stethoscope",
  "cross",
];

function InteractiveBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const supportsPointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId = 0;
    let time = 0;
    let pulseOffset = 0;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    const blobs = [
      { x: 0.15, y: 0.18, r: 220, color: TEAL_RGB, speed: 0.28, phase: 0.2 },
      { x: 0.85, y: 0.22, r: 240, color: NAVY_RGB, speed: 0.22, phase: 1.4 },
      { x: 0.75, y: 0.8, r: 210, color: TEAL_RGB, speed: 0.26, phase: 2.5 },
      { x: 0.2, y: 0.75, r: 200, color: NAVY_RGB, speed: 0.3, phase: 3.2 },
    ];

    let icons = [];

    const createIcons = () => {
      const count = Math.min(22, Math.floor((width * height) / 75000) + 12);
      icons = Array.from({ length: count }, (_, i) => ({
        kind: ICON_KINDS[i % ICON_KINDS.length],
        x: Math.random() * width,
        y: Math.random() * height,
        size: 16 + Math.random() * 22,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.003,
        driftX: (Math.random() - 0.5) * 0.12,
        driftY: (Math.random() - 0.5) * 0.12,
        opacity: 0.1 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        teal: i % 2 === 0,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pointer.x = pointer.tx = width * 0.55;
      pointer.y = pointer.ty = height * 0.35;
      createIcons();
    };

    const drawBackground = () => {
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, "#f8fafc");
      g.addColorStop(0.5, "#ffffff");
      g.addColorStop(1, "#f1f5f9");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    };

    const drawBlobs = () => {
      ctx.globalCompositeOperation = "multiply";
      blobs.forEach((blob, index) => {
        const swayX = Math.sin(time * blob.speed + blob.phase) * 36;
        const swayY = Math.cos(time * blob.speed * 0.8 + blob.phase) * 28;
        const reactX = (pointer.x / width - 0.5) * (20 + index * 4);
        const reactY = (pointer.y / height - 0.5) * (16 + index * 3);
        const x = blob.x * width + swayX + reactX;
        const y = blob.y * height + swayY + reactY;
        const pulse = 1 + Math.sin(time * 0.6 + blob.phase) * 0.06;
        const [r, g, b] = blob.color;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, blob.r * pulse);
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.1)`);
        glow.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.035)`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(x, y, blob.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
    };

    /** Repeating CareLink logo pulse — clear ECG strip */
    const drawLogoPulseBand = (yBase, color, scale, offset, lineWidth) => {
      const segmentW = 56 * scale;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      let started = false;
      for (let x = -segmentW; x < width + segmentW; x += 2) {
        const local = ((x + offset) % segmentW + segmentW) % segmentW;
        const t = local / segmentW;
        const px = t * 28;
        let py = 0;
        if (px < 5) py = 0;
        else if (px < 7.5) py = ((px - 5) / 2.5) * -6;
        else if (px < 11) py = -6 + ((px - 7.5) / 3.5) * 18;
        else if (px < 14.5) py = 12 + ((px - 11) / 3.5) * -22;
        else if (px < 17.5) py = -10 + ((px - 14.5) / 3) * 17;
        else if (px < 20) py = 7 + ((px - 17.5) / 2.5) * -7;
        else py = 0;

        const y = yBase + py * scale;
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    const drawPulseBands = () => {
      pulseOffset += 1.5;
      const y1 = height * 0.42 + Math.sin(time * 0.3) * 8;
      const y2 = height * 0.68 + Math.cos(time * 0.25) * 6;

      ctx.beginPath();
      ctx.strokeStyle = "rgba(16, 24, 96, 0.045)";
      ctx.lineWidth = 10;
      ctx.moveTo(0, y1);
      ctx.lineTo(width, y1);
      ctx.stroke();

      drawLogoPulseBand(y1, "rgba(16, 24, 96, 0.28)", 1.4, pulseOffset, 2.6);
      drawLogoPulseBand(
        y2,
        "rgba(64, 192, 160, 0.24)",
        1.15,
        pulseOffset * 0.75,
        2.2
      );

      if (supportsPointer && pointer.active) {
        ctx.save();
        ctx.translate(pointer.x - 40, pointer.y);
        ctx.scale(1.9, 1.9);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(64, 192, 160, 0.65)";
        ctx.lineWidth = 2.3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        LOGO_PULSE.forEach(([x, y], i) => {
          const py = y - 30;
          if (i === 0) ctx.moveTo(x - 18, py);
          else ctx.lineTo(x - 18, py);
        });
        ctx.stroke();
        ctx.restore();
      }
    };

    const strokeRoundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };

    const drawPill = (s) => {
      strokeRoundRect(-s * 0.55, -s * 0.22, s * 1.1, s * 0.44, s * 0.22);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.roundRect(-s * 0.55, -s * 0.22, s * 0.55, s * 0.44, s * 0.22);
      ctx.fill();
    };

    const drawCapsule = (s) => {
      strokeRoundRect(-s * 0.2, -s * 0.55, s * 0.4, s * 1.1, s * 0.2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1.5;
      ctx.moveTo(-s * 0.2, 0);
      ctx.lineTo(s * 0.2, 0);
      ctx.stroke();
    };

    const drawBottle = (s) => {
      ctx.beginPath();
      ctx.roundRect(-s * 0.28, -s * 0.15, s * 0.56, s * 0.75, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(-s * 0.14, -s * 0.42, s * 0.28, s * 0.28, 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.roundRect(-s * 0.18, s * 0.05, s * 0.36, s * 0.28, 2);
      ctx.fill();
    };

    const drawSyringe = (s) => {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-s * 0.55, 0);
      ctx.lineTo(s * 0.35, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-s * 0.15, -s * 0.18, s * 0.5, s * 0.36, 3);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.35, 0);
      ctx.lineTo(s * 0.55, -s * 0.08);
      ctx.lineTo(s * 0.55, s * 0.08);
      ctx.closePath();
      ctx.fill();
    };

    const drawScalpel = (s) => {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, s * 0.08);
      ctx.lineTo(s * 0.15, s * 0.08);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.1, s * 0.08);
      ctx.lineTo(s * 0.55, -s * 0.2);
      ctx.lineTo(s * 0.45, s * 0.18);
      ctx.closePath();
      ctx.fill();
    };

    const drawXray = (s) => {
      ctx.lineWidth = 1.8;
      ctx.strokeRect(-s * 0.45, -s * 0.4, s * 0.9, s * 0.8);
      // ribs / skeleton hint
      for (let i = -2; i <= 2; i += 1) {
        ctx.beginPath();
        ctx.ellipse(0, i * s * 0.12, s * 0.28, s * 0.06, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.32);
      ctx.lineTo(0, s * 0.32);
      ctx.stroke();
    };

    const drawStethoscope = (s) => {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-s * 0.2, -s * 0.15, s * 0.22, Math.PI * 0.15, Math.PI * 1.1);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.2, -s * 0.15, s * 0.22, Math.PI * 0.9, Math.PI * 1.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-s * 0.2, s * 0.05);
      ctx.quadraticCurveTo(0, s * 0.45, s * 0.25, s * 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.32, s * 0.28, s * 0.14, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawCross = (s) => {
      const arm = s * 0.26;
      const len = s * 0.72;
      ctx.beginPath();
      ctx.roundRect(-arm / 2, -len / 2, arm, len, 3);
      ctx.roundRect(-len / 2, -arm / 2, len, arm, 3);
      ctx.fill();
    };

    const drawIconShape = (kind, size) => {
      if (kind === "pill") drawPill(size);
      else if (kind === "capsule") drawCapsule(size);
      else if (kind === "bottle") drawBottle(size);
      else if (kind === "syringe") drawSyringe(size);
      else if (kind === "scalpel") drawScalpel(size);
      else if (kind === "xray") drawXray(size);
      else if (kind === "stethoscope") drawStethoscope(size);
      else drawCross(size);
    };

    const drawIcons = () => {
      icons.forEach((icon) => {
        const dx = pointer.x - icon.x;
        const dy = pointer.y - icon.y;
        const dist = Math.hypot(dx, dy) || 1;
        const pull =
          pointer.active && dist < 220 ? ((220 - dist) / 220) * 12 : 0;

        icon.x += icon.driftX + (dx / dist) * pull * 0.02;
        icon.y += icon.driftY + (dy / dist) * pull * 0.02;
        icon.rotation += icon.spin;
        icon.phase += 0.02;

        if (icon.x < -40) icon.x = width + 40;
        if (icon.x > width + 40) icon.x = -40;
        if (icon.y < -40) icon.y = height + 40;
        if (icon.y > height + 40) icon.y = -40;

        const breathe = 1 + Math.sin(icon.phase) * 0.05;
        const near = pointer.active && dist < 160 ? 0.08 : 0;
        const [r, g, b] = icon.teal ? TEAL_RGB : NAVY_RGB;
        const alpha = icon.opacity + near;

        ctx.save();
        ctx.translate(icon.x, icon.y);
        ctx.rotate(icon.rotation);
        ctx.scale(breathe, breathe);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        drawIconShape(icon.kind, icon.size);
        ctx.restore();
      });
    };

    const drawCursorAura = () => {
      if (!supportsPointer) return;
      const aura = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        0,
        pointer.x,
        pointer.y,
        240
      );
      aura.addColorStop(0, "rgba(64, 192, 160, 0.1)");
      aura.addColorStop(0.45, "rgba(16, 24, 96, 0.04)");
      aura.addColorStop(1, "rgba(16, 24, 96, 0)");
      ctx.beginPath();
      ctx.fillStyle = aura;
      ctx.arc(pointer.x, pointer.y, 240, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      time += 0.016;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      drawBackground();
      drawBlobs();
      drawPulseBands();
      drawIcons();
      drawCursorAura();

      animationId = requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    resize();

    if (prefersReducedMotion) {
      drawBackground();
      drawBlobs();
      drawPulseBands();
      return undefined;
    }

    animationId = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    if (supportsPointer) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", handlePointerLeave);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerLeave
      );
    };
  }, []);

  return (
    <div className="landing-interactive-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="landing-bg-canvas" />
      <div className="landing-bg-vignette" />
    </div>
  );
}

export default InteractiveBackdrop;
