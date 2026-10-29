import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KineticAI — Biomechanics & Intelligent Fitness Coach',
  description: 'AI Workout Split Generator, Multimodal Meal Scans, and Real-time Biomechanics Form Coach',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="cyber-neon">
      <body>{children}</body>
    </html>
  );
}

