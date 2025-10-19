'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const links = [
  { href: '/about', label: 'About' },
  { href: '/work', label: 'Work' },
  { href: '/playground', label: 'Playground' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
  { href: '/resume', label: 'Resume' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 text-neutral-900 font-extrabold">
            YT
          </div>
          <span className="text-sm tracking-wide text-white/70 group-hover:text-white/90">
            Yashvi Tank
          </span>
        </Link>

        <nav className="hidden gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="btn btn-primary">
          Let&apos;s Connect <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
