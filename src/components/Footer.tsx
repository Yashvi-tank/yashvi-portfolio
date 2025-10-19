import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 mt-16">
      <div className="container flex flex-col items-center justify-between gap-4 text-center sm:flex-row">
        <div className="text-white/60">
          © {new Date().getFullYear()} Yashvi Tank — Crafted with Next.js & Tailwind
        </div>
        <div className="flex items-center gap-4 text-white/60">
          <Link href="https://github.com/your-github" className="hover:text-white">
            GitHub
          </Link>
          <Link href="https://www.linkedin.com/in/your-linkedin" className="hover:text-white">
            LinkedIn
          </Link>
          <Link href="#top" className="hover:text-white">
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
