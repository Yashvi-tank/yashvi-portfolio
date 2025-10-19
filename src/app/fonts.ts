import { Anton, Space_Grotesk } from 'next/font/google';

export const display = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

export const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});
