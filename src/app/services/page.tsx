import Card from '@/components/Card';
import SectionHeader from '@/components/SectionHeader';
import Pill from '@/components/Pill';
import { Palette, Code2, Rocket, CircleCheck } from 'lucide-react';

export default function ServicesPage() {
  return (
    <section className="py-16">
      <SectionHeader title="Services" right={<Pill>For startups & teams</Pill>} />
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Product Design',
            desc: 'UX research, wireframes, design systems, hi-fi prototypes.',
            icon: Palette,
          },
          {
            title: 'Frontend Engineering',
            desc: 'React/Next.js, TypeScript, Tailwind, integration & perf.',
            icon: Code2,
          },
          {
            title: 'Rapid Prototyping',
            desc: 'Idea to interactive MVPs and demo decks.',
            icon: Rocket,
          },
        ].map((s, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-3">
              <s.icon className="h-6 w-6" />
              <div className="text-lg font-semibold">{s.title}</div>
            </div>
            <p className="mt-2 text-white/70">{s.desc}</p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4" /> Accessible, responsive, performant
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4" /> Clean, maintainable code
              </li>
              <li className="flex items-center gap-2">
                <CircleCheck className="h-4 w-4" /> Collaborative and detail-oriented
              </li>
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
