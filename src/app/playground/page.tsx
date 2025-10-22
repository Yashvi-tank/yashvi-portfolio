'use client';

import TechCarousel, { TechItem } from '@/components/TechCarousel';

const TECHS: TechItem[] = [
  { id: 'ts',    name: 'TypeScript', emoji: '🧩', tagline: 'Types for large-scale apps', color: 'from-sky-500/40 to-indigo-500/40', link: 'https://www.typescriptlang.org/' },
  { id: 'react', name: 'React',      emoji: '⚛️', tagline: 'UI library for web apps',    color: 'from-cyan-400/40 to-blue-500/40',  link: 'https://react.dev' },
  { id: 'next',  name: 'Next.js',    emoji: '⏭️', tagline: 'SSR/SSG framework',         color: 'from-zinc-500/40 to-slate-600/40', link: 'https://nextjs.org' },
  { id: 'tail',  name: 'Tailwind',   emoji: '🎨', tagline: 'Utility-first CSS',           color: 'from-emerald-500/40 to-teal-500/40', link: 'https://tailwindcss.com' },
  { id: 'node',  name: 'Node.js',    emoji: '🟢', tagline: 'Server-side JS runtime',      color: 'from-green-500/40 to-lime-500/40',  link: 'https://nodejs.org' },
  { id: 'py',    name: 'Python',     emoji: '🐍', tagline: 'Rapid scripting & ML',        color: 'from-yellow-400/40 to-amber-500/40', link: 'https://www.python.org' },
  { id: 'sql',   name: 'SQL',        emoji: '🗄️', tagline: 'Relational queries',         color: 'from-fuchsia-500/40 to-pink-500/40' },
  { id: 'aws',   name: 'AWS',        emoji: '☁️', tagline: 'Cloud services',              color: 'from-orange-500/40 to-rose-500/40' },
  { id: 'docker',name: 'Docker',     emoji: '🐳', tagline: 'Containerization',            color: 'from-sky-500/40 to-blue-600/40' },
  { id: 'git',   name: 'Git',        emoji: '🔧', tagline: 'Version control',             color: 'from-rose-400/40 to-red-500/40' },
  { id: 'linux', name: 'Linux',      emoji: '🐧', tagline: 'Servers & tooling',           color: 'from-emerald-400/40 to-blue-400/40' },
  { id: 'redis', name: 'Redis',      emoji: '🚀', tagline: 'In-memory datastore',         color: 'from-red-500/40 to-orange-500/40' },
  { id: 'fast',  name: 'FastAPI',    emoji: '⚡', tagline: 'Python web APIs',             color: 'from-teal-400/40 to-emerald-500/40' },
];

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="mx-auto max-w-6xl px-6 pt-24 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Playground</h1>
        <p className="mt-2 text-white/70">
          A quick tour of my favorite technologies. Scroll horizontally or drag. Auto-scroll is on.
        </p>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <TechCarousel
          items={TECHS}
          cardWidth={420}
          gap={20}
          autoScroll
          pixelsPerSecond={80}  // adjust 30..80 to taste
        />
      </section>
    </main>
  );
}
