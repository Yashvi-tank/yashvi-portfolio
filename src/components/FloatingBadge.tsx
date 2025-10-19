'use client';

import { motion } from 'framer-motion';

type FloatingBadgeProps = {
  label: string;            // e.g., "Python"
  short?: string;           // e.g., "Py" (rendered in the circle)
  delay?: number;           // animation delay (stagger)
  size?: number;            // px diameter (default 64)
  hue?: number;             // 0–360 for gradient color
};

export default function FloatingBadge({
  label,
  short,
  delay = 0,
  size = 64,
  hue = 180,
}: FloatingBadgeProps) {
  const d = size;

  return (
    <motion.div
      aria-label={label}
      title={label}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: [0, -8, 0], opacity: 1 }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      whileHover={{ scale: 1.08 }}
      className="grid place-items-center rounded-full shadow-lg shadow-black/30 border border-white/10 text-sm font-semibold select-none"
      style={{
        width: d,
        height: d,
        background:
          `linear-gradient(140deg, hsl(${hue} 90% 70% / .18), hsl(${hue + 40} 90% 60% / .12))`,
        backdropFilter: 'blur(6px)',
      }}
    >
      <span className="text-xs sm:text-sm text-white/90">
        {short ?? label}
      </span>
    </motion.div>
  );
}
