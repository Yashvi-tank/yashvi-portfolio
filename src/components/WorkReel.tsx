'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import WorkTile from './WorkTile';

type Item = {
  title: string;
  desc: string;
  href?: string;
  image?: string;
  tags?: string[];
};

export default function WorkReel({ items }: { items: Item[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  // progress bar tied to horizontal scroll
  const { scrollXProgress } = useScroll({ container: scrollerRef });
  const scaleX = useTransform(scrollXProgress, [0, 1], [0, 1]);

  // detect the tile closest to center to add .is-active
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      let minD = Infinity;
      let idx = 0;
      [...el.querySelectorAll<HTMLElement>('[data-tile]')].forEach((tile, i) => {
        const r = tile.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < minD) {
          minD = d;
          idx = i;
        }
      });
      setActive(idx);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // ────────────────────────────────────────────────────────────
  // 1) Map vertical wheel to horizontal scroll (only when hovering)
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!hovering) return;             // only when mouse is over the reel
      // if there's a horizontal delta already (two-finger left/right), let browser do its thing
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // convert vertical wheel to horizontal scroll
      e.preventDefault(); // need passive: false
      const speed = 1;    // tweak sensitivity: 1–2 feels good
      el.scrollBy({ left: e.deltaY * speed, behavior: 'smooth' });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [hovering]);

  // ────────────────────────────────────────────────────────────
  // 2) Keyboard helpers when focused/hovered
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (!hovering && document.activeElement !== el) return;

      const unit = el.clientWidth * 0.8; // nearly a card width
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault();
        el.scrollBy({ left: unit, behavior: 'smooth' });
      } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        el.scrollBy({ left: -unit, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hovering]);

  return (
    <section className="relative">
      {/* soft edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-bg to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-bg to-transparent z-20" />

      {/* reel */}
      <div
        ref={scrollerRef}
        className="no-scrollbar relative flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 outline-none"
        tabIndex={0}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {items.map((it, i) => (
          <div
            key={it.title}
            data-tile
            className={`transition-transform duration-300 ${
              i === active ? 'is-active scale-[1.02]' : 'scale-[0.96]'
            }`}
          >
            <WorkTile
              title={it.title}
              desc={it.desc}
              href={it.href}
              image={it.image}
              tags={it.tags}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* progress bar */}
      <div className="mt-6 h-1 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          style={{ scaleX, transformOrigin: '0% 50%' }}
          className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-fuchsia-400"
        />
      </div>
    </section>
  );
}
