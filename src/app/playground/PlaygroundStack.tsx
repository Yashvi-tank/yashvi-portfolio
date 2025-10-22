'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type TechItem = {
  id: string;
  name: string;
  tagline?: string;
  emoji?: string;       // quick icon
  color?: string;       // tailwind bg e.g. "from-emerald-500 to-cyan-500"
  link?: string;        // optional link to docs
};

type Props = {
  items: TechItem[];
  initial?: number;     // initial focused index
};

export default function PlaygroundStack({ items, initial = 0 }: Props) {
  const [active, setActive] = useState(initial);

  // Keep active index valid even if items change
  useEffect(() => {
    if (active > items.length - 1) setActive(items.length - 1);
  }, [items, active]);

  const go = useCallback((dir: 1 | -1) => {
    setActive((i) => {
      const next = i + dir;
      if (next < 0) return items.length - 1;
      if (next > items.length - 1) return 0;
      return next;
    });
  }, [items.length]);

  // allow keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Compute visual layout for each card relative to active index
  const layout = useMemo(() => {
    const L = items.length;
    return items.map((_, i) => {
      // distance from active (wrap around for nicer pile)
      const forward = (i - active + L) % L;
      // active: 0; next: 1; next2: 2; ... others go to the back pile
      const depth = forward;

      // Center card
      if (depth === 0) {
        return {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          z: 100,
          blur: 0,
          opacity: 1,
        };
      }

      // Pile behind the center
      const maxShown = 5; // show up to 5 in the pile for clarity
      const k = Math.min(depth, maxShown); // clamp depth
      const y = 16 * k;                     // stagger down
      const scale = 1 - 0.04 * k;           // smaller further away
      const rotate = (k % 2 === 0 ? -1 : 1) * (4 + k); // a little tilt
      const x = (k % 2 === 0 ? -1 : 1) * (6 + 2 * k);  // slight horizontal jitter
      const z = 100 - k;
      const blur = k >= maxShown ? 2 : 0.5 * k;        // distant blur
      const opacity = k >= maxShown ? 0 : 1 - 0.05 * k;

      return { x, y, rotate, scale, z, blur, opacity };
    });
  }, [items, active]);

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
      {/* Controls */}
      <div className="mb-5 flex items-center gap-2">
        <button
          onClick={() => go(-1)}
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
        >
          ← Prev
        </button>
        <span className="text-white/60 text-sm">Click a card or use ← →</span>
        <button
          onClick={() => go(1)}
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
        >
          Next →
        </button>
      </div>

      {/* Stack stage */}
      <div className="relative h-[520px] w-full">
        <AnimatePresence initial={false}>
          {items.map((it, i) => {
            const L = layout[i];
            return (
              <motion.button
                key={it.id}
                onClick={() => setActive(i)}
                className="absolute left-1/2 top-1/2 w-[680px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none"
                style={{ zIndex: L.z }}
                initial={false}
                animate={{
                  x: L.x,
                  y: L.y,
                  rotate: L.rotate,
                  scale: L.scale,
                  opacity: L.opacity,
                  filter: `blur(${L.blur}px)`,
                }}
                transition={{ type: 'spring', stiffness: 160, damping: 18 }}
              >
                <Card it={it} isActive={i === active} />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Card({ it, isActive }: { it: TechItem; isActive: boolean }) {
  return (
    <div
      className={[
        'rounded-2xl border border-white/10 overflow-hidden',
        'bg-neutral-900/70 backdrop-blur',
        'shadow-[0_30px_80px_-30px_rgba(0,0,0,.6)]',
      ].join(' ')}
    >
      {/* Header gradient */}
      <div
        className={[
          'h-28 w-full',
          'bg-gradient-to-tr',
          it.color || 'from-sky-500/40 to-emerald-500/40',
        ].join(' ')}
      />

      <div className="p-7 md:p-8">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-2xl">
            <span>{it.emoji ?? '💡'}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-semibold leading-tight">{it.name}</h3>
            {it.tagline && (
              <p className="mt-1 text-white/70">{it.tagline}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          {it.link && isActive && (
            <a
              href={it.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 transition-colors"
            >
              Docs / More →
            </a>
          )}
          <span className="text-xs text-white/50">
            {isActive ? 'Focused' : 'In stack'}
          </span>
        </div>
      </div>
    </div>
  );
}
