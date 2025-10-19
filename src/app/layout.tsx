import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { display, sans } from './fonts';

export const metadata: Metadata = {
  title: 'Yashvi Tank — Portfolio',
  description: 'EPITA CS/AI student portfolio',
  openGraph: { title: 'Yashvi Tank — Portfolio', images: ['/og-image.png'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable}`}>
        <Navbar />
        <main className="container" id="top">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
