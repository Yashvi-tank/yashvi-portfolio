'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Item = { label: string; short?: string };

type Props = {
  items?: Item[];
  count?: number;           // number of bubbles
  innerRadius?: number;     // "hole" around name (px)
  outerRadius?: number;     // max spread from the center (used as min bound size)
  // Feel free to tweak these:
  repelRadius?: number;     // px around cursor where bubbles get repelled
  repelStrength?: number;   // acceleration away from cursor
  friction?: number;        // velocity damping each frame
};

const DEFAULT_ITEMS: Item[] = [
  { label: 'Python', short: 'Py' },
  { label: 'Java', short: 'Java' },
  { label: 'TypeScript', short: 'TS' },
  { label: 'JavaScript', short: 'JS' },
  { label: 'SQL', short: 'SQL' },
  { label: 'MongoDB', short: 'Mongo' },
  { label: 'React', short: 'React' },
  { label: 'Next.js', short: 'Next' },
  { label: 'Node', short: 'Node' },
  { label: 'Tailwind', short: 'TW' },
  { label: 'AWS', short: 'AWS' },
  { label: 'Docker', short: 'Docker' },
  { label: 'Git', short: 'Git' },
  { label: 'Linux', short: 'Linux' },
  { label: 'Redis', short: 'Redis' },
  { label: 'FastAPI', short: 'Fast' },
];

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const rnd = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/**
 * The coordinate system is centered in the hero.
 * We animate x,y in that local system and render with translate(x,y).
 */
export default function OrbitCloud({
  items = DEFAULT_ITEMS,
  count,
  innerRadius,
  outerRadius,
  repelRadius = 160,
  repelStrength = 1800, // higher = stronger push
  friction = 0.995,     // 0.98..0.997 is nice
}: Props) {
  // Responsive config (computed on client only)
  const [cfg, setCfg] = useState<{
    width: number;     // canvas width in px
    height: number;    // canvas height in px
    inner: number;     // hole radius
    size: number;      // base bubble diameter
    count: number;     // bubbles count
  }>();

  // Simulation state refs (so we can update without re-rendering every frame)
  const bubblesRef = useRef<
    {
      label: string;
      short?: string;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;   // diameter
      hue: number;    // for tint
    }[]
  >([]);

  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // A small tick state just to re-render DOM nodes (positions come from inline styles)
  const [tick, setTick] = useState(0);

  // Choose the items subset only once per mount
  const picked = useMemo(() => shuffle(items), [items]);

  useEffect(() => {
    // Compute hero canvas size from viewport (stay inside the screen)
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Canvas should never exceed screen size; keep it generous but safe
    const width = Math.min(w - 48, 1200);          // padding from edges
    const height = Math.min(Math.floor(h * 0.72), 720);

    const c = {
      width,
      height,
      inner: innerRadius ?? (w < 480 ? 190 : w < 1024 ? 210 : 230),
      size: w < 480 ? 70 : w < 1024 ? 90 : 110,
      count: count ?? (w < 480 ? 12 : w < 1024 ? 16 : 18),
    };
    setCfg(c);

    // Set up bubbles within the rectangle bounds (taking size into account)
    const left = -width / 2, right = width / 2;
    const top = -height / 2, bottom = height / 2;

    const arr: typeof bubblesRef.current = [];
    const subset = picked.slice(0, Math.min(c.count, picked.length));

    subset.forEach((it) => {
      const size = c.size * (0.9 + Math.random() * 0.3);
      const r = size / 2;

      let x = 0, y = 0;
      // Keep out of the inner "name" hole
      for (let attempts = 0; attempts < 500; attempts++) {
        x = rnd(left + r, right - r);
        y = rnd(top + r, bottom - r);
        if (Math.hypot(x, y) > c.inner + r + 8) break; // a bit of margin
      }

      const speed = rnd(18, 38);     // px/sec
      const dir = rnd(0, Math.PI * 2);
      arr.push({
        label: it.label,
        short: it.short,
        x, y,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        size,
        hue: Math.round(rnd(165, 210)),
      });
    });

    bubblesRef.current = arr;

    // Track mouse in hero-local coordinates
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      cursorRef.current = { x: e.clientX - cx, y: e.clientY - cy };
    };
    window.addEventListener('mousemove', onMove);

    // Animation loop
    const loop = (t: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = t;
      const dt = Math.min((t - lastTimeRef.current) / 1000, 0.033); // seconds, clamp big jumps
      lastTimeRef.current = t;

      stepSimulation(dt, {
        width: c.width,
        height: c.height,
        inner: c.inner,
        repelRadius,
        repelStrength,
        friction,
      });

      // trigger a light refresh ~60fps
      setTick((v) => (v + 1) % 1000000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, count, innerRadius, outerRadius, repelRadius, repelStrength, friction]);

  // Physics step
  const stepSimulation = (
    dt: number,
    opts: {
      width: number;
      height: number;
      inner: number;
      repelRadius: number;
      repelStrength: number;
      friction: number;
    }
  ) => {
    const { width, height, inner, repelRadius, repelStrength, friction } = opts;
    const left = -width / 2;
    const right = width / 2;
    const top = -height / 2;
    const bottom = height / 2;

    const cursor = cursorRef.current;

    for (const b of bubblesRef.current) {
      const r = b.size / 2;

      // 1) Cursor repulsion
      if (cursor) {
        const dx = b.x - cursor.x;
        const dy = b.y - cursor.y;
        const d = Math.hypot(dx, dy);
        if (d > 0 && d < repelRadius + r) {
          const n = 1 - d / (repelRadius + r);
          const ax = (dx / d) * repelStrength * n; // push away
          const ay = (dy / d) * repelStrength * n;
          b.vx += ax * dt;
          b.vy += ay * dt;
        }
      }

      // 2) Keep away from name hole (soft push outwards if inside)
      const dCenter = Math.hypot(b.x, b.y);
      const minDist = inner + r + 6;
      if (dCenter < minDist && dCenter > 0) {
        const k = (minDist - dCenter) * 18; // stiffness
        b.vx += (b.x / dCenter) * k * dt;
        b.vy += (b.y / dCenter) * k * dt;
      }

      // 3) Integrate
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // 4) Bounce on rectangle bounds
      if (b.x - r < left) {
        b.x = left + r;
        b.vx = Math.abs(b.vx);
      } else if (b.x + r > right) {
        b.x = right - r;
        b.vx = -Math.abs(b.vx);
      }
      if (b.y - r < top) {
        b.y = top + r;
        b.vy = Math.abs(b.vy);
      } else if (b.y + r > bottom) {
        b.y = bottom - r;
        b.vy = -Math.abs(b.vy);
      }

      // 5) Friction
      b.vx *= friction;
      b.vy *= friction;

      // 6) Very small clamp to avoid denormals
      b.vx = clamp(b.vx, -800, 800);
      b.vy = clamp(b.vy, -800, 800);
    }
  };

  if (!cfg) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[48%] z-0 -translate-x-1/2 -translate-y-1/2"
      style={{ width: cfg.width, height: cfg.height }}
    >
      {/* Donut mask to keep a clean hole around your name */}
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[1400px] w-[1400px] -translate-x-1/2 -translate-y-1/2"
        style={{
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, transparent ${cfg.inner}px, black ${cfg.inner + 1}px)`,
          maskImage: `radial-gradient(circle at 50% 50%, transparent ${cfg.inner}px, black ${cfg.inner + 1}px)`,
        }}
      />

      {/* Render bubbles */}
      {bubblesRef.current.map((b, i) => {
        const glow = `0 0 60px hsla(${b.hue}, 80%, 60%, .22)`;
        return (
          <div
            key={b.label + i + tick} // tick forces repaint to update translate
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(${b.x}px, ${b.y}px)` }}
          >
            <div
              className="grid place-items-center rounded-full border border-white/12 shadow-md"
              style={{
                width: b.size,
                height: b.size,
                boxShadow: glow,
                background: `radial-gradient(circle at 32% 28%,
                  hsla(${b.hue}, 70%, 75%, .28),
                  hsla(${b.hue + 20}, 70%, 55%, .12))`,
                backdropFilter: 'blur(14px)',
                opacity: 0.72,
              }}
              title={b.label}
              aria-label={b.label}
            >
              <span className="text-[13px] font-semibold text-white/85 select-none">
                {b.short ?? b.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
