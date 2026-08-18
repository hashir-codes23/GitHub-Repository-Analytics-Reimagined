import { useEffect, useRef } from 'react';

// Full-screen canvas of soft golden particles that continuously
// drift from the bottom of the screen to the top.
export default function ParticleBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(90, Math.max(30, Math.floor((window.innerWidth * window.innerHeight) / 16000)));
    const make = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 12,
      r: 1 + Math.random() * 2.6,
      vy: 0.25 + Math.random() * 0.55, // upward speed
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.004 + Math.random() * 0.01,
      driftAmp: 8 + Math.random() * 22,
      alpha: 0.16 + Math.random() * 0.34
    });
    const parts = Array.from({ length: count }, () => make(true));

    const isDark = () => document.documentElement.classList.contains('dark');

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const rgb = isDark() ? '250, 204, 21' : '217, 119, 6';
      for (const p of parts) {
        p.y -= p.vy; // flow: bottom -> top
        p.drift += p.driftSpeed;
        const x = p.x + Math.sin(p.drift) * p.driftAmp * 0.4;
        if (p.y < -12) Object.assign(p, make(false));
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
        ctx.shadowColor = `rgba(${rgb}, 0.7)`;
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
