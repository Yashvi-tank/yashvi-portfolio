'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useRef } from 'react';

type WorkCardProps = {
  title: string;
  desc: string;
  href?: string;
  tags?: string[];
  image?: string; // optional thumbnail
  index?: number; // for stagger
};

export default function WorkCard({
  title,
  desc,
  href = '#',
  tags = [],
  image,
  index = 0,
}: WorkCardProps) {
  // --- interactive tilt/parallax on hover:
  const ref = useRef<HTMLDivElement | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);

  const rotateX = useTransform(ry, [-50, 50], [10, -10]);
  const rotateY = useTransform(rx, [-50, 50], [-10, 10]);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // 0 -> width
    const y = e.clientY - rect.top;  // 0 -> height
    rx.set((x / rect.width) * 100 - 50);
    ry.set((y / rect.height) * 100 - 50);
  };

  const onMouseLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <Link href={href} className="group block focus:outline-none">
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 }}
        className="relative"
      >
        {/* Card shell */}
        <motion.div
          style={{ rotateX, rotateY }}
          className="card overflow-hidden"
        >
          {/* Media / gradient */}
          <div className="relative aspect-video w-full">
            {/* thumbnail or gradient */}
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-cyan-400/20 via-fuchsia-400/10 to-emerald-400/10" />
            )}

            {/* subtle top shimmer line */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* cursor-follow glow */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.10), transparent 60%)',
              }}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const rect = el.getBoundingClientRect();
                el.style.setProperty('--x', `${e.clientX - rect.left}px`);
                el.style.setProperty('--y', `${e.clientY - rect.top}px`);
              }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold">{title}</h4>
              <ExternalLink className="h-4 w-4 text-white/60 transition-colors group-hover:text-white" />
            </div>
            <p className="mt-2 text-white/70">{desc}</p>

            {/* Marquee-style tags on hover (slides slightly) */}
            {tags.length > 0 && (
              <div className="mt-3 overflow-hidden">
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: -8 }}
                  transition={{ type: 'tween', duration: 0.35 }}
                  className="flex flex-wrap gap-2 text-xs text-white/60"
                >
                  {tags.map((t) => (
                    <span key={t} className="pill">
                      {t}
                    </span>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {/* floating border highlight */}
        <div className="pointer-events-none absolute -inset-px rounded-2xl border border-white/10 opacity-0 ring-1 ring-white/10 transition-opacity group-hover:opacity-100" />
      </motion.div>
    </Link>
  );
}
