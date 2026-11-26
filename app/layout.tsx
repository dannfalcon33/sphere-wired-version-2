import type { Metadata, Viewport } from 'next';
import { Orbitron, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#080511',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Sphere Wired — Connectivity, Rewired.',
  description:
    'Experience a decentralized, seamless, and high-performance digital ecosystem built on the next generation of data architecture. Autonomous mesh routing, zero-trust optical encryption, and deterministic edge consensus.',
  applicationName: 'Sphere Wired',
  keywords: [
    'Sphere Wired',
    'decentralized networking',
    'autonomous mesh routing',
    'optical consensus',
    'zero-trust encryption',
    'edge relay infrastructure',
    'sovereign data architecture',
  ],
  authors: [{ name: 'Sphere Wired Foundation AG' }],
  creator: 'Sphere Wired Foundation AG',
  publisher: 'Sphere Wired Foundation AG',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Sphere Wired — Connectivity, Rewired.',
    description:
      'A decentralized, seamless, and high-performance digital ecosystem built on next-generation optical routing, deterministic edge consensus, and zero-trust data architecture.',
    siteName: 'Sphere Wired',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sphere Wired — Connectivity, Rewired.',
    description:
      'Autonomous mesh routing, post-quantum optical encryption, and measured global relay capacity across 148 exchange points.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${plusJakartaSans.variable} ${jetBrainsMono.variable} scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#080511] text-[#E8E4F3] font-sans antialiased selection:bg-[#9333EA]/40 selection:text-white overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}
