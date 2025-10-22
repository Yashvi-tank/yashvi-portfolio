import SectionHeader from '@/components/SectionHeader';
import Pill from '@/components/Pill';
import WorkReel from '@/components/WorkReel';

const projects = [
  {
    title: 'Linda Agentic AI',
    desc: 'Multi-agent RAG assistant with Streamlit UI, sources & agent trace.',
    tags: ['Python', 'Streamlit', 'OpenAI', 'Pinecone'],
    href: '#',
    image: '/images/linda.jpg',
  },
  {
    title: 'SafeWalk',
    desc: 'Night-safety Android app with real-time alerts and maps.',
    tags: ['Android', 'Java', 'Maps'],
    href: '#',
    image: '/images/safewalk.jpg',
  },
  {
    title: 'Cognivue Talent',
    desc: 'Interview intelligence prototype; FastAPI backend + UI orchestration.',
    tags: ['FastAPI', 'Redis', 'UI/UX'],
    href: '#',
    image: '/images/cognivue.jpg',
  },
  {
    title: 'Red Alert',
    desc: 'Web-based cycle tracker with animations and mood logging.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    href: '#',
    image: '/images/redalert.jpg',
  },
];

export default function WorkPage() {
  return (
    <section className="py-16">
      <SectionHeader title="Selected Work" right={<Pill>Swipe / Scroll →</Pill>} />
      <WorkReel items={projects} />
    </section>
  );
}
