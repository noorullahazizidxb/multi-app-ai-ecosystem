'use client';

import * as React from 'react';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { cn } from '../lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Dialog } from './dialog';
import { AppearanceManager } from './appearance-manager';

export interface AppConfig {
  id: 'careerforge' | 'kinetic' | 'freelanceos' | 'viralmatrix';
  name: string;
  tagline: string;
  subdomain: string;
  defaultTheme: string;
  copilotPrice: string;
  freeQuotaLabel: string;
}

export const ECOSYSTEM_APPS: Record<string, AppConfig> = {
  careerforge: {
    id: 'careerforge',
    name: 'CareerForge AI',
    tagline: 'Resume Builder & Job Copilot',
    subdomain: 'careerforge.devminds.net',
    defaultTheme: 'clean-slate',
    copilotPrice: '$19/mo',
    freeQuotaLabel: '5 AI Rewrites/mo',
  },
  kinetic: {
    id: 'kinetic',
    name: 'KineticAI',
    tagline: 'AI Fitness & Biomechanics Coach',
    subdomain: 'kinetic.devminds.net',
    defaultTheme: 'cyber-neon',
    copilotPrice: '$14/mo',
    freeQuotaLabel: '3 Scans/wk',
  },
  freelanceos: {
    id: 'freelanceos',
    name: 'FreelanceOS',
    tagline: 'Client Scope & Collections Copilot',
    subdomain: 'freelanceos.devminds.net',
    defaultTheme: 'obsidian-gold',
    copilotPrice: '$24/mo',
    freeQuotaLabel: '5 AI Docs/mo',
  },
  viralmatrix: {
    id: 'viralmatrix',
    name: 'ViralMatrix AI',
    tagline: 'Video Repurposing & Omnichannel Studio',
    subdomain: 'viralmatrix.devminds.net',
    defaultTheme: 'synthwave-sunset',
    copilotPrice: '$29/mo',
    freeQuotaLabel: '3 Videos/mo',
  },
};

export interface AppShellProps {
  appId: 'careerforge' | 'kinetic' | 'freelanceos' | 'viralmatrix';
  children: React.ReactNode;
  activeNav?: string;
  className?: string;
}

export function AppShell({ appId, children, activeNav = 'app', className }: AppShellProps) {
  const currentApp = ECOSYSTEM_APPS[appId];
  const [appearanceOpen, setAppearanceOpen] = React.useState(false);
  const [ecosystemMenuOpen, setEcosystemMenuOpen] = React.useState(false);

  return (
    <div className={cn('min-h-screen bg-bg text-text flex flex-col font-sans transition-colors duration-200', className)}>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Identity & App Switcher */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-2.5">
              <div
                aria-hidden="true"
                className="w-8 h-8 shrink-0 rounded-lg bg-blue-600 dark:bg-orange-500 flex items-center justify-center text-white dark:text-orange-950 font-black text-sm shadow-sm"
              >
                {currentApp.name.charAt(0)}
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold text-sm tracking-tight text-text">{currentApp.name}</span>
                  <Badge variant="outline" className="hidden sm:inline-flex text-[10px] py-0 px-1.5 font-mono">
                    {currentApp.subdomain}
                  </Badge>
                </div>
                <span className="text-[11px] text-text-muted hidden md:inline">{currentApp.tagline}</span>
              </div>
            </Link>

            {/* Ecosystem Apps Dropdown Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setEcosystemMenuOpen(!ecosystemMenuOpen)}
                className="text-xs h-8 px-2 rounded-md border border-border hover:bg-bg text-text-muted hover:text-text transition-colors flex items-center gap-1 cursor-pointer"
                title="Switch Ecosystem App"
                aria-label="Switch Ecosystem App"
                aria-expanded={ecosystemMenuOpen}
              >
                <LayoutGrid aria-hidden="true" className="size-3.5" />
                <span className="hidden sm:inline">Apps</span>
                <span aria-hidden="true" className="hidden sm:inline text-[9px]">▼</span>
              </button>

              {ecosystemMenuOpen && (
                <div
                  className="absolute left-0 mt-2 w-64 rounded-xl border border-border bg-surface shadow-xl p-2 z-50 flex flex-col gap-1"
                  onClick={() => setEcosystemMenuOpen(false)}
                >
                  <div className="px-2 py-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                    Ecosystem Verticals
                  </div>
                  {Object.values(ECOSYSTEM_APPS).map((app) => (
                    <a
                      key={app.id}
                      href={`https://${app.subdomain}`}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-lg text-xs transition-colors hover:bg-bg',
                        app.id === appId ? 'bg-primary/10 text-primary font-semibold' : 'text-text',
                      )}
                    >
                      <div className="flex flex-col">
                        <span>{app.name}</span>
                        <span className="text-[10px] text-text-muted">{app.subdomain}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {app.copilotPrice}
                      </Badge>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center / Right Navigation Controls */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Free Quota / Model 1 Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-bg text-xs">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span className="text-text-muted">Free Tier:</span>
              <strong className="text-text">{currentApp.freeQuotaLabel}</strong>
            </div>

            {/* Admin WS Telemetry Route */}
            <Link href="/admin">
              <Button
                variant={activeNav === 'admin' ? 'default' : 'outline'}
                size="sm"
                className="text-xs gap-1.5 h-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                <span>
                  <span className="hidden sm:inline">Live </span>Admin
                </span>
              </Button>
            </Link>

            {/* Appearance & Layout Controls Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAppearanceOpen(true)}
              className="text-xs gap-1.5 h-8 border-primary/40 hover:border-primary"
              title="Theme & Layout Management"
            >
              <span>🎨</span>
              <span className="hidden sm:inline">Theme & Layout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/40 py-6 text-center text-xs text-text-muted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Unified Multi-App AI Ecosystem • Domain: <strong className="text-text">devminds.net</strong></span>
          <div className="flex items-center gap-3">
            <span>Turborepo + pnpm</span>
            <span>•</span>
            <span>Prisma v8 Dynamic</span>
            <span>•</span>
            <span>Next.js 15</span>
          </div>
        </div>
      </footer>

      {/* Appearance & Layout Manager Dialog */}
      <Dialog
        isOpen={appearanceOpen}
        onClose={() => setAppearanceOpen(false)}
        title="Theme Appearance & Workspace Management"
        description="Select from 10 calibrated OKLCH theme presets and configure workspace density"
      >
        <div className="mt-2">
          <AppearanceManager currentTheme={currentApp.defaultTheme} />
        </div>
      </Dialog>
    </div>
  );
}
