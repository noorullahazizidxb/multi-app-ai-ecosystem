'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import { PRESET_OPTIONS, ThemeSwitcher } from './theme-switcher';
import { LayoutManager } from './layout-manager';
import { Badge } from './badge';

export interface AppearanceManagerProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
  className?: string;
  showLayoutControls?: boolean;
}

export function AppearanceManager({
  currentTheme = 'clean-slate',
  onThemeChange,
  className,
  showLayoutControls = true,
}: AppearanceManagerProps) {
  const [activeTab, setActiveTab] = React.useState<'theme' | 'layout'>('theme');
  const [selectedTheme, setSelectedTheme] = React.useState(currentTheme);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('app-theme-preset');
      const domTheme = document.documentElement.getAttribute('data-theme');
      const resolved = saved || domTheme || currentTheme;
      if (resolved && resolved !== selectedTheme) {
        setSelectedTheme(resolved);
      }
    } catch {}
  }, [currentTheme]);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
      try {
        localStorage.setItem('app-theme-preset', themeId);
      } catch (e) {}
    }
    onThemeChange?.(themeId);
  };

  const activePreset = PRESET_OPTIONS.find((p) => p.id === selectedTheme) || PRESET_OPTIONS[0];

  return (
    <div className={cn('flex flex-col gap-4 p-5 rounded-2xl border border-border bg-surface/95 backdrop-blur-md shadow-lg', className)}>
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-text tracking-tight">Appearance & Workspace Manager</h2>
            <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider">
              10 OKLCH PRESETS
            </Badge>
          </div>
          <p className="text-xs text-text-muted">
            Real-time theme switching & responsive layout configuration
          </p>
        </div>

        {showLayoutControls && (
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-bg border border-border self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('theme')}
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer',
                activeTab === 'theme'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-muted hover:text-text',
              )}
            >
              Theme & Colors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('layout')}
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer',
                activeTab === 'layout'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-text-muted hover:text-text',
              )}
            >
              Layout & Density
            </button>
          </div>
        )}
      </div>

      {activeTab === 'theme' || !showLayoutControls ? (
        <div className="flex flex-col gap-4">
          {/* Active Preset Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm flex items-center justify-center font-bold text-white text-xs"
                style={{ backgroundColor: activePreset.previewColor }}
              >
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text">{activePreset.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {activePreset.persona}
                  </Badge>
                </div>
                <span className="text-xs text-text-muted">
                  Default for: <strong className="text-text">{activePreset.defaultFor}</strong>
                </span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono text-text-muted">data-theme=&quot;{activePreset.id}&quot;</span>
            </div>
          </div>

          {/* Theme Presets Grid */}
          <ThemeSwitcher
            currentTheme={selectedTheme}
            onThemeChange={handleThemeSelect}
            className="border-0 p-0 bg-transparent"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <LayoutManager className="border-0 p-0 bg-transparent" />
        </div>
      )}
    </div>
  );
}
