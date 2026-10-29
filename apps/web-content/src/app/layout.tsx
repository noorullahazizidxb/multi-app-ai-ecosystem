import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ViralMatrix AI — Video Repurposer & Omnichannel Short Generator',
  description: 'Convert Long-Form Videos into Viral Hooks, Threads, and 9:16 Reframed Vertical Shorts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="synthwave-sunset">
      <body>{children}</body>
    </html>
  );
}

