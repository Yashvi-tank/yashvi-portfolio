import Card from '@/components/Card';
import { Download } from 'lucide-react';

export default function ResumePage() {
  return (
    <section className="py-16">
      <Card className="flex items-center justify-between p-6">
        <div>
          <div className="text-lg font-semibold">Download my resume</div>
          <div className="text-sm text-white/70">
            One-page PDF — updated for internship applications
          </div>
        </div>
        <a href="/Yashvi_Tank_Resume.pdf" className="btn btn-ghost">
          <Download className="h-5 w-5" /> Resume PDF
        </a>
      </Card>
    </section>
  );
}
