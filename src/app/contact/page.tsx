'use client';

import Card from '@/components/Card';
import { Mail, Phone, Linkedin } from 'lucide-react';
import { site } from '@/lib/site';

export default function ContactPage() {
  return (
    <section className="py-16">
      <Card className="p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold">Let&apos;s build something delightful.</h3>
            <p className="mt-2 text-white/70">
              Open to internships, freelance, and collaborations in Paris/remote.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={`mailto:${site.email}`} className="btn btn-primary">
                <Mail className="h-5 w-5" /> Email me
              </a>
              <a href="tel:+33000000000" className="btn btn-ghost">
                <Phone className="h-5 w-5" /> Call
              </a>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <Linkedin className="h-5 w-5" /> LinkedIn
              </a>
            </div>
          </div>
          <div>
            <form onSubmit={(e) => e.preventDefault()} className="grid gap-3">
              <input
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40"
                placeholder="Your name"
              />
              <input
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40"
                placeholder="Email"
              />
              <textarea
                rows={4}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/40"
                placeholder="Tell me about the project..."
              />
              <button className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>
      </Card>
    </section>
  );
}
