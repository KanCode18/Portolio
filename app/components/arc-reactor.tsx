'use client';

import { useEffect, useRef } from 'react';

interface ArcReactorProps {
  compact?: boolean;
  active?: boolean;
}

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
  color: string;
  orbit: number;
}

interface DataArc {
  r: number;
  start: number;
  span: number;
  color: string;
  width: number;
  speed: number;
}

interface HUDTick {
  angle: number;
  len: number;
  alpha: number;
}

interface SegmentedRingDef {
  r: number;
  n: number;
  w: number;
  alpha: number;
  dir: number;
}

export default function ArcReactor({ compact = false, active = false }: ArcReactorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({
    scanAngle: 0,
    scanIntensity: 0,
    nextScan: 3000 + Math.random() * 4000,
    lastScanTime: 0,
    active: active,
  });

  // Keep active state in sync without restarting the loop
  useEffect(() => {
    stateRef.current.active = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const rect = canvas.getBoundingClientRect();
    const SIZE = Math.round(compact ? 42 : Math.min(rect.width || 420, rect.height || 420));
    canvas.width = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const scale = SIZE / 420; // everything authored at 420px, scaled uniformly

    // Resolve CSS vars once (falls back to hardcoded if vars unavailable)
    const style = getComputedStyle(document.documentElement);
    const CORE  = style.getPropertyValue('--accent').trim()   || '#42d9ff';
    const CORE2 = style.getPropertyValue('--accent-2').trim() || '#79ffe1';
    const WARM  = style.getPropertyValue('--warm').trim()     || '#d6b36a';

    // ── Particles ──────────────────────────────────────────────────────────
    const particleCount = compact ? 0 : 32;
    const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      angle:  (i / particleCount) * Math.PI * 2,
      radius: 90 + Math.random() * 60,
      speed:  (0.004 + Math.random() * 0.006) * (Math.random() < 0.5 ? 1 : -1),
      size:   1 + Math.random() * 2.5,
      alpha:  0.3 + Math.random() * 0.6,
      color:  Math.random() < 0.7 ? CORE : CORE2,
      orbit:  0.8 + Math.random() * 0.4,
    }));

    // ── HUD ticks ──────────────────────────────────────────────────────────
    const ticks: HUDTick[] = Array.from({ length: 72 }, (_, i) => ({
      angle: (i / 72) * Math.PI * 2,
      len:   i % 6 === 0 ? 14 : i % 3 === 0 ? 8 : 4,
      alpha: i % 6 === 0 ? 0.7 : i % 3 === 0 ? 0.4 : 0.18,
    }));

    // ── Data arcs ──────────────────────────────────────────────────────────
    const dataArcs: DataArc[] = [
      { r: 148, start: 0.12, span: 0.44, color: CORE,  width: 2.5, speed:  0.0008 },
      { r: 148, start: 0.60, span: 0.22, color: CORE2, width: 1.5, speed:  0.0008 },
      { r: 148, start: 0.88, span: 0.08, color: WARM,  width: 1.5, speed:  0.0008 },
      { r: 164, start: 0.05, span: 0.28, color: CORE2, width: 2.0, speed: -0.0006 },
      { r: 164, start: 0.40, span: 0.18, color: CORE,  width: 1.5, speed: -0.0006 },
      { r: 164, start: 0.65, span: 0.30, color: WARM,  width: 1.0, speed: -0.0006 },
      { r: 178, start: 0.00, span: 0.15, color: CORE,  width: 3.0, speed:  0.0005 },
      { r: 178, start: 0.20, span: 0.35, color: CORE2, width: 1.5, speed:  0.0005 },
      { r: 178, start: 0.62, span: 0.12, color: WARM,  width: 2.0, speed:  0.0005 },
    ];

    // ── Segmented rings ────────────────────────────────────────────────────
    const segRings: SegmentedRingDef[] = [
      { r: 168, n: 18, w: 2.0, alpha: 0.50,  dir:  1 },
      { r: 155, n: 24, w: 1.2, alpha: 0.35,  dir: -1 },
    ];

    // ── Helpers ────────────────────────────────────────────────────────────
    function drawRing(r: number, width: number, alpha: number, dash: number[] = [], rotation = 0) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.strokeStyle = `rgba(66,217,255,${alpha})`;
      ctx.lineWidth = width * scale;
      ctx.setLineDash(dash.map(d => d * scale));
      ctx.beginPath();
      ctx.arc(0, 0, r * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    function drawHUDTicks(outerR: number, t: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ticks.forEach((tk) => {
        const a = tk.angle + t * 0.04;
        const r1 = outerR * scale;
        const r2 = (outerR + tk.len) * scale;
        ctx.strokeStyle = `rgba(66,217,255,${tk.alpha})`;
        ctx.lineWidth = (tk.len > 10 ? 1.5 : 0.8) * scale;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.stroke();
      });
      ctx.restore();
    }

    function drawDataArcs(now: number) {
      ctx.lineCap = 'round';
      dataArcs.forEach((a) => {
        const off = now * a.speed;
        const s = (a.start + off) * Math.PI * 2;
        const e = s + a.span * Math.PI * 2;
        ctx.strokeStyle = a.color;
        ctx.lineWidth = a.width * scale;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(cx, cy, a.r * scale, s, e);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.lineCap = 'butt';
    }

    function drawSegmentedRings(t: number) {
      segRings.forEach((sr) => {
        const rot = t * 0.16 * sr.dir;
        ctx.lineWidth = sr.w * scale;
        for (let i = 0; i < sr.n; i++) {
          const a0 = rot + (i / sr.n) * Math.PI * 2;
          const a1 = a0 + (0.6 / sr.n) * Math.PI * 2;
          const c = i % 3 === 0 ? CORE : i % 3 === 1 ? CORE2 : WARM;
          ctx.strokeStyle = c;
          ctx.globalAlpha = sr.alpha * (0.5 + 0.5 * Math.sin(t * 2 + i));
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(cx, cy, sr.r * scale, a0, a1);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.lineCap = 'butt';
      });
    }

    function drawRadialSpokes(t: number) {
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r1 = 38 * scale;
        const r2 = (62 + Math.sin(t * 1.4 + i) * 6) * scale;
        ctx.strokeStyle = `rgba(66,217,255,${0.09 + Math.sin(t + i) * 0.04})`;
        ctx.lineWidth = 0.8 * scale;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.stroke();
      }
    }

    function drawCore(pulse: number) {
      const r = (30 + pulse * 4) * scale;

      // outer ambient glow
      const outerG = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3.5);
      outerG.addColorStop(0,   `rgba(66,217,255,${0.18 + pulse * 0.1})`);
      outerG.addColorStop(0.5, `rgba(66,217,255,${0.06 + pulse * 0.04})`);
      outerG.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = outerG;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // core body
      const coreG = ctx.createRadialGradient(
        cx - r * 0.2, cy - r * 0.2, 0,
        cx, cy, r
      );
      coreG.addColorStop(0,    `rgba(255,255,255,${0.92 + pulse * 0.08})`);
      coreG.addColorStop(0.2,  `rgba(121,255,225,${0.85 + pulse * 0.1})`);
      coreG.addColorStop(0.55, `rgba(66,217,255,${0.6 + pulse * 0.2})`);
      coreG.addColorStop(1,    'rgba(0,30,50,0)');
      ctx.fillStyle = coreG;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // specular highlight
      const specG = ctx.createRadialGradient(
        cx - r * 0.3, cy - r * 0.35, 0,
        cx, cy, r * 0.5
      );
      specG.addColorStop(0, 'rgba(255,255,255,0.9)');
      specG.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = specG;
      ctx.beginPath();
      ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawParticles(t: number) {
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius * p.orbit * scale;
        const py = cy + Math.sin(p.angle) * p.radius * p.orbit * scale;
        const flicker = 0.5 + Math.sin(t * 3 + p.angle * 7) * 0.5;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * flicker;
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function drawScan(now: number) {
      const s = stateRef.current;

      if (now - s.lastScanTime > s.nextScan || s.active) {
        if (!s.active) {
          s.lastScanTime = now;
          s.nextScan = 3000 + Math.random() * 4000;
        }
        s.scanIntensity = Math.min(1, s.scanIntensity + (s.active ? 0.06 : 1));
      }

      if (s.scanIntensity > 0.01) {
        s.scanAngle += 0.08;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(s.scanAngle);
        const sg = ctx.createLinearGradient(0, 0, 190 * scale, 0);
        sg.addColorStop(0,   `rgba(66,217,255,${s.scanIntensity * 0.55})`);
        sg.addColorStop(0.5, `rgba(66,217,255,${s.scanIntensity * 0.15})`);
        sg.addColorStop(1,   'rgba(66,217,255,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 190 * scale, -0.28, 0.28);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        if (!s.active) s.scanIntensity *= 0.94;
      }
    }

    function drawBgGlow(pulse: number) {
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200 * scale);
      bg.addColorStop(0,   `rgba(4,30,50,${0.55 + pulse * 0.1})`);
      bg.addColorStop(0.6, 'rgba(2,12,22,0.45)');
      bg.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(cx, cy, 200 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Main loop ──────────────────────────────────────────────────────────
    function frame(now: number) {
      const t = now * 0.001;
      ctx.clearRect(0, 0, SIZE, SIZE);

      const breathe = (Math.sin(t * 1.2) + 1) * 0.5;
      const pulse   = breathe * 0.5;

      // In compact mode just draw the core + two rings
      if (compact) {
        drawCore(pulse);
        drawRing(16, 1, 0.35 + pulse * 0.15);
        drawRing(20, 0.6, 0.18, [2, 4], t * 0.35);
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      drawBgGlow(pulse);
      drawScan(now);

      // Structural outer rings
      drawRing(192, 0.5, 0.12 + pulse * 0.06);
      drawRing(190, 0.5, 0.09, [3, 9], t * 0.15);
      drawHUDTicks(184, t);

      // Data bands
      drawDataArcs(now);

      // Segmented decorative rings
      drawSegmentedRings(t);

      // Inner structural rings
      drawRing(145, 1,   0.28 + pulse * 0.10);
      drawRing(128, 0.5, 0.14, [5, 7], -t * 0.20);
      drawRing(112, 1.5, 0.22 + pulse * 0.08);
      drawRing(100, 0.8, 0.15 + pulse * 0.08, [4, 8], t * 0.25);
      drawRing( 85, 1,   0.35 + pulse * 0.15);
      drawRing( 72, 0.8, 0.20, [3, 5],  t * 0.35);
      drawRing( 60, 1.2, 0.30 + pulse * 0.12);

      drawRadialSpokes(t);
      drawParticles(t);
      drawCore(pulse);

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [compact]); // only re-init if compact changes; active is read via ref

  if (compact) {
    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ width: 42, height: 42, flexShrink: 0, background: 'transparent', borderRadius: '50%' }}
      />
    );
  }

  // Full hero reactor: fills the arc-trigger button which is already sized by CSS
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        background: 'transparent',
        borderRadius: '50%',
        overflow: 'hidden',
      }}
    />
  );
}