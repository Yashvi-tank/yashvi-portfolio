'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import FloatingBadge from './FloatingBadge';
import { useEffect } from 'react';

type CloudItem = {
  label: string;
  short?: string;
  hue?: number;
  size?: number;
};

const DEFAULTS: CloudItem[] = [
  { label: 'Python', short: 'Py', hue: 200 },
  { label: 'Java', short: 'Java', hue: 15 },
  { label: 'SQL', short: 'SQL', hue: 260, size: 56 },
  { label: 'MongoDB', short: 'Mongo', hue: 130 },
  { label: 'React', short: 'React', hue: 190 },
  { label: 'Next.js', short: 'Next', hue: 210 },
  { label: 'Node', short: 'Node', hue: 140 },
  { label: 'Tailwind', short: 'TW', hue: 185, size: 56 },
];


export default function TechCloud({
  items = DEFAULTS,
}: {
  items?: CloudItem[];
}) {
  // mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smoothX = useSpring(mx, { stiffness: 60, damping: 15 });
  const smoothY = useSpring(my, { stiffness: 60, damping: 15 });

  // scale parallax movement
  const px = useTransform(smoothX, [-150, 150], [-10, 10]);
  const py = useTransform(smoothY, [-150, 150], [-8, 8]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mx.set(e.clientX - cx);
      my.set(e.clientY - cy);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my]);

  // positions (relative to container center)
  // tweak these to adjust layout
  const rings = [
    // ring 1 (inner)
    [
      { x: -220, y: -10 }, // left
      { x:  220, y:  -4 }, // right
      { x:   40, y: -130 },
      { x:  -40, y:  130 },
    ],
    // ring 2 (outer)
    [
      { x: -300, y: -120 },
      { x:  300, y: -120 },
      { x: -320, y:  120 },
      { x:  320, y:  120 },
    ],
  ];

  // flatten positions and map to items
  const positions = [...rings[0], ...rings[1]];

  return (
    <div className="relative h-[380px] sm:h-[440px] w-full">
      {/* center accent glow */}
      <motion.div
        style={{ x: px, y: py }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          filter: 'blur(60px)',
          background:
            'radial-gradient(closest-side, rgba(0,255,194,.16), transparent 70%)',
        }}
      />

      {/* badges */}
      {items.slice(0, positions.length).map((it, i) => {
        const p = positions[i];
        return (
          <motion.div
            key={it.label}
            style={{ x: p.x, y: p.y, translateX: '-50%', translateY: '-50%' }}
            className="absolute left-1/2 top-1/2"
          >
            <FloatingBadge
              label={it.label}
              short={it.short}
              hue={it.hue}
              size={it.size ?? 64}
              delay={i * 0.12}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
