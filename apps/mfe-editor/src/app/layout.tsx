import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PatternForge — 3D Editor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-white antialiased overflow-hidden">{children}</body>
    </html>
  );
}
