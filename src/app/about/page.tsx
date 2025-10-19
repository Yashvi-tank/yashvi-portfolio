import Card from '@/components/Card';
import { MapPin, Code2, Palette, ShieldCheck, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <section className="py-16">
      <Card className="p-8">
        <div className="grid gap-8 md:grid-cols-[1fr,280px]">
          <div>
            <h3 className="text-2xl font-bold">
              I craft experiences that balance form, function, and feasibility.
            </h3>
            <p className="mt-4 text-white/80">
              With a background in CS/AI at EPITA, I understand both{' '}
              <span className="mx-1 rounded bg-white/10 px-1.5">code</span> and
              <span className="mx-1 rounded bg-white/10 px-1.5">creativity</span>. I love
              transforming ideas into thoughtful prototypes and production UI.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { icon: Code2, text: 'React, TypeScript, Next.js, Tailwind' },
                { icon: Palette, text: 'Figma, design systems, accessibility' },
                { icon: ShieldCheck, text: 'Testing, linting, performance' },
                { icon: Rocket, text: 'Rapid prototyping, hackathons' },
              ].map((it, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80">
                  <it.icon className="h-5 w-5 text-white/70" />
                  <span>{it.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/0 p-6">
            <div className="text-sm text-white/70">Currently in</div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
              <MapPin className="h-5 w-5" /> Paris, France
            </div>
            <div className="mt-6 text-sm text-white/70">Education</div>
            <div className="mt-1 font-semibold">
              EPITA — BSc (3rd year), Computer Science / AI
            </div>
            <div className="mt-6 text-sm text-white/70">Open to</div>
            <div className="mt-1 font-semibold">Internship (Product/Frontend/AI)</div>
          </div>
        </div>
      </Card>
    </section>
  );
}
