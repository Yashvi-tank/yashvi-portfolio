import Card from '@/components/Card';
import SectionHeader from '@/components/SectionHeader';
import Pill from '@/components/Pill';

const demos = [
  'Glassmorphism UI',
  'AI Prompt UI',
  'Parallax Scroll',
  'Micro-interactions',
  'Theme Switcher',
  'Charts',
];

export default function PlaygroundPage() {
  return (
    <section className="py-16">
      <SectionHeader title="Playground" right={<Pill>Experiments</Pill>} />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {demos.map((title) => (
          <Card key={title} className="p-5">
            <div className="mb-3 aspect-[4/3] w-full rounded-xl bg-white/5" />
            <div className="font-medium">{title}</div>
            <div className="mt-1 text-sm text-white/70">
              Small experiment exploring motion, accessibility, and neat UI details.
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
