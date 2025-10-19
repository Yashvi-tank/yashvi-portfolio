'use client';

import OrbitCloud from '@/components/OrbitCloud';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* ─────────────────────────────
          HERO SECTION WITH FLOATING BUBBLES
      ───────────────────────────── */}
      <section className="relative isolate overflow-hidden flex flex-col items-center justify-center py-24 sm:py-32 text-center">
        {/* Floating tech bubbles (background layer) */}
        <OrbitCloud
          count={16}          // number of bubbles
          innerRadius={160}   // hole radius (keeps clear space for name)
          outerRadius={340}   // maximum floating radius
        />

        {/* Main hero content (foreground layer) */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6">
          {/* Tagline above heading */}
          <p className="mb-6 rounded-full bg-white/5 px-4 py-2 text-sm text-white/80">
            EPITA • 3rd year Bachelor&apos;s • Paris, France
          </p>

          {/* Heading */}
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Hello, I&apos;m
          </h1>

          <h2 className="mt-2 mb-6 block text-[68px] sm:text-[112px] md:text-[140px] font-extrabold leading-none">
            Yashvi Tank
          </h2>

          {/* Accent line */}
          <div className="mb-8 h-1 w-28 rounded-full bg-gradient-to-r from-emerald-400 to-fuchsia-400 opacity-80" />

          {/* Sub-heading */}
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            Product-minded Frontend/AI Student. I blend engineering rigor with playful creativity to build delightful, accessible interfaces.
          </p>

          {/* Call-to-action buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/15 transition-colors"
            >
              Let&apos;s Connect
            </a>
            <a
              href="#availability"
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-sm font-medium text-emerald-200 hover:bg-emerald-500/15 transition-colors"
            >
              Available for internships
            </a>
          </div>

          {/* Social links */}
          <div className="mt-8 flex gap-6 text-sm text-white/70">
            <a href="mailto:your@email.com" className="hover:text-white transition-colors">
              Email
            </a>
            <a href="https://github.com/yourgithub" target="_blank" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://linkedin.com/in/your-linkedin" target="_blank" className="hover:text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────
          FOOTER
      ───────────────────────────── */}
      <footer className="py-10 text-center text-sm text-white/50">
        © 2025 Yashvi Tank — Crafted with Next.js &amp; Tailwind
      </footer>
    </main>
  );
}
