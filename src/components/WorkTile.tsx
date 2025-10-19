'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useRef } from 'react';

type Props = {
  title: string;
  desc: string;
  href?: string;
  image?: string; // /images/xxx.jpg
  tags?: string[];
  index?: number;
};

export default function WorkTile({
  title,
  desc,
  href = '#',
  image,
  tags = [],
  index = 0,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // magnetic content follow
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useTransform(mx, [-40, 40], [-6, 6]);
  const ty = useTransform(my, [-40, 40], [-6, 6]);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(e.clientX - (r.left + r.width / 2));
    my.set(e.clientY - (r.top + r.height / 2));
    // spotlight position
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.06 }}
      className="group relative snap-center shrink-0 w-[86vw] sm:w-[640px] md:w-[720px] lg:w-[820px] rounded-3xl overflow-hidden"
    >
      {/* media */}
      <div className="relative aspect-[16/9]">
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

        {/* spotlight glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(420px circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.12), transparent 45%)',
          }}
        />

        {/* dim neighbors – will be lifted by active styles from Reel */}
        <div className="pointer-events-none absolute inset-0 bg-black/30 backdrop-blur-[0px] transition-all duration-300 group-[.is-active]:bg-transparent" />
      </div>

      {/* content */}
      <motion.div
        style={{ x: tx, y: ty }}
        className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8"
      >
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {title}
          </h4>
          <ExternalLink className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
        </div>
        <p className="mt-2 max-w-2xl text-white/80">{desc}</p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/75">
            {tags.map((t) => (
              <span key={t} className="pill bg-white/10 border-white/15">
                {t}
              </span>
            ))}
          </div>
        )}
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 self-start rounded-2xl bg-white px-4 py-2 text-neutral-900 font-semibold hover:bg-white/90"
        >
          View case study <ExternalLink className="h-4 w-4" />
        </Link>
      </motion.div>
    </motion.article>
  );
}
