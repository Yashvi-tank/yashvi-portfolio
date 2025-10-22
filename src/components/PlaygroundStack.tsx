'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type TechItem = {
  id: string;
  name: string;
  tagline?: string;
  emoji?: string;
  color?: string;   // tailwind gradient like "from-sky-500/40 to-indigo-500/40"
  link?: string;
};

type Props = {
  items: TechItem[];
  initial?: number;
};

/* ---------------------- Tuning knobs (aesthetic) ---------------------- */
const MAX_SHOWN = 4;     // pile depth shown behind the active card
const STEP_Y = 10;       // how much each stacked card moves down
const STEP_X = 10;       // slight x jitter
const STEP_ROT = 2.5;    // slight rotation per depth
const SCALE_STEP = 0.06; // how much each stacked card shrinks
const BLUR_STEP = 0.6;   // blur per depth
const OPACITY_STEP = 0.08;
/* --------------------------------------------------------------------- */

export default function PlaygroundStack({ items, initial = 0 }: Props) {
  const [active, setActive] = useState(initial);

  // keep index valid if items change
  useEffect(() => {
    if (active > items.length - 1) setActive(Math.max(0, items.length - 1));
  }, [items, active]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setActive((i) => {
        const n = items.length;
        return (i + dir + n) % n;
      });
    },
    [items.length]
  );

  // keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // layout for each card relative to active (0 is center, 1 is next, etc.)
  const layout = useMemo(() => {
    const L = items.length;
    return items.map((_, i) => {
      const d = (i - active + L) % L;

      if (d === 0) {
        return {
          x: 0, y: 0, rotate: 0, scale: 1,
          z: 100, blur: 0, opacity: 1,
          isActive: true,
        };
      }

      const k = Math.min(d, MAX_SHOWN);
      return {
        x: (k % 2 ? STEP_X : -STEP_X) * k,
        y: STEP_Y * k,
        rotate: (k % 2 ? STEP_ROT : -STEP_ROT) * (k + 1),
        scale: 1 - SCALE_STEP * k,
        z: 100 - k,
        blur: BLUR_STEP * k,
        opacity: Math.max(0, 1 - OPACITY_STEP * k),
        isActive: false,
      };
    });
  }, [items, active]);

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Controls — minimal */}
      <div className="mb-6 flex items-center justify-center gap-3 text-sm">
        <button
          onClick={() => go(-1)}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75 hover:bg-white/10"
        >
          ← Prev
        </button>
        <span className="text-white/50">Click a card or use ← →</span>
        <button
          onClick={() => go(1)}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/75 hover:bg-white/10"
        >
          Next →
        </button>
      </div>

      {/* Stage */}
      <div className="relative h-[460px] w-full">
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
                whileHover={L.isActive ? { scale: 1.02 } : {}}
                transition={{ type: 'spring', stiffness: 170, damping: 22 }}
              >
                <Card it={it} isActive={L.isActive} />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------- Card -------------------------------- */

function Card({ it, isActive }: { it: TechItem; isActive: boolean }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/8 bg-neutral-900/60 backdrop-blur-xl shadow-[0_30px_70px_-30px_rgba(0,0,0,.55)]">
      {/* Top stripe (thin, elegant) */}
      <div className={`h-20 w-full bg-gradient-to-tr ${it.color ?? 'from-sky-500/30 to-emerald-500/30'}`} />

      <div className="p-7 md:p-8">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-xl">
            <span>{it.emoji ?? '💡'}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-[22px] md:text-[26px] font-semibold tracking-tight">
              {it.name}
            </h3>
            {it.tagline && (
              <p className="mt-1 text-sm text-white/70">{it.tagline}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          {it.link && isActive && (
            <a
              href={it.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/15 transition-colors"
            >
              Docs / More →
            </a>
          )}
          <span className="text-xs text-white/45">
            {isActive ? 'Focused' : 'In stack'}
          </span>
        </div>
      </div>
    </div>
  );
}
