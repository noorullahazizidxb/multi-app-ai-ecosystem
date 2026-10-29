import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareerForge AI — Executive Resume Builder & Job Copilot',
  description: 'AI-Powered ATS Keyword Optimization and Autonomous Job Application Copilot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="clean-slate">
      <body>{children}</body>
    </html>
  );
}

