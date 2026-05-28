import type { Metadata } from 'next';
import { Fraunces, Nunito, JetBrains_Mono, Caveat } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Idle Maker — Sketchbook Studio for Weird Idle Games',
  description:
    'A creator\u2019s sketchbook for designing, balancing, prototyping and exporting idle/clicker/incremental games.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${nunito.variable} ${jetbrains.variable} ${caveat.variable}`}
    >
      <body className="font-nunito bg-paper text-ink antialiased min-h-screen">{children}</body>
    </html>
  );
}
