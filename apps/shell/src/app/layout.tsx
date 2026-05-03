import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PatternForge — AI-Powered 3D Pattern Generator',
  description: 'Generate stunning 3D patterns with AI. Describe your vision, we render it.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
