import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FreelanceOS — Workspace, Contracts & Scope Copilot',
  description: 'AI Contract Generator, Mobile Receipt OCR, and Autonomous Scope-Creep Shield',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="obsidian-gold">
      <body>{children}</body>
    </html>
  );
}

