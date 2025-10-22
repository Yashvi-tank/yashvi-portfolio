'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export type TechItem = {
  id: string;
  name: string;
  tagline?: string;
  emoji?: string;
  color?: string;  // Tailwind gradient, e.g. "from-sky-500/40 to-indigo-500/40"
  link?: string;
};

type Props = {
  items: TechItem[];
  cardWidth?: number;      // px (visual width of a card)
  gap?: number;            // px gap between cards
  autoScroll?: boolean;    // default true
  pixelsPerSecond?: number;// default 40 (gentle)
};

export default function TechCarousel({
  items,
  cardWidth = 420,
  gap = 20,
  autoScroll = true,
  pixelsPerSecond = 40,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // pause when user interacts
  const [paused, setPaused] = useState(false);

  // Build the visual items (we duplicate them for seamless looping)
  const visualItems = useMemo(() => {
    // at least 2× to loop seamlessly; 3× feels safer for wider screens
    return [...items, ...items, ...items];
  }, [items]);

  // Animate translateX on the track
  useEffect(() => {
    if (!autoScroll) return;

    const el = trackRef.current;
    if (!el) return;

    let x = 0;
    let last = performance.now();
    let frame = 0;

    // Measure the length of one "cycle" (first copy of items)
    // We'll reset to 0 when we move past -cycleWidth to create a seamless loop.
    const measureCycle = () => {
      // width of one copy (cardWidth + gap) * original items length
      return items.length * (cardWidth + gap);
    };
    let cycleWidth = measureCycle();

    const step = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.033); // seconds, clamp
      last = t;

      if (!paused) {
        const dx = pixelsPerSecond * dt;
        x -= dx;

        // when we've shifted left by one full cycle, snap back to 0
        if (x <= -cycleWidth) {
          x += cycleWidth;
        }

        el.style.transform = `translate3d(${x}px,0,0)`;
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    // re-measure on resize
    const onResize = () => {
      cycleWidth = measureCycle();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, [autoScroll, paused, pixelsPerSecond, items.length, cardWidth, gap]);

  // Also allow click-drag to “scroll” the track manually by changing paused + x
  useEffect(() => {
    const el = containerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    let down = false;
    let startX = 0;
    let startTx = 0;

    const currentTx = () => {
      const m = /translate3d\((-?\d+(\.\d+)?)px/.exec(track.style.transform || '');
      return m ? parseFloat(m[1]) : 0;
    };

    const onDown = (e: PointerEvent) => {
      down = true;
      setPaused(true);
      startX = e.clientX;
      startTx = currentTx();
      el.setPointerCapture(e.pointerId);
      (el as HTMLElement).style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      const tx = startTx + dx;
      track.style.transform = `translate3d(${tx}px,0,0)`;
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      (el as HTMLElement).style.cursor = '';
      el.releasePointerCapture(e.pointerId);
      setPaused(false);
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointerleave', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointerleave', onUp);
    };
  }, []);

  // Card visual spacing
  const cardStyle = useMemo(
    () => ({ minWidth: `${cardWidth}px`, width: `${cardWidth}px`, marginRight: `${gap}px` }),
    [cardWidth, gap]
  );

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ transform: 'translate3d(0px,0,0)' }}
      >
        {visualItems.map((it, i) => (
          <div key={`${it.id}-${i}`} style={cardStyle}>
            <FloatCard it={it} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Card --------------------------- */

function FloatCard({ it }: { it: TechItem }) {
  return (
    <motion.div
      className="
        h-[280px]
        rounded-3xl border border-white/8
        bg-neutral-900/60 backdrop-blur-xl
        shadow-[0_30px_70px_-30px_rgba(0,0,0,.55)]
        overflow-hidden
        group
      "
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
    >
      <motion.div
        className={`h-16 w-full bg-gradient-to-tr ${it.color ?? 'from-sky-500/30 to-emerald-500/30'}`}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: [0.7, 0.9, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-xl">
            <span>{it.emoji ?? '💡'}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-[20px] md:text-[22px] font-semibold tracking-tight">{it.name}</h3>
            {it.tagline && <p className="mt-1 text-sm text-white/70">{it.tagline}</p>}
          </div>
        </div>

        <div className="mt-5">
          {it.link ? (
            <a
              href={it.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/15 transition-colors"
            >
              Docs / More →
            </a>
          ) : (
            <span className="text-xs text-white/45">Tech</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
