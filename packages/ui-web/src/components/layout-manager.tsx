'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';
export type LayoutWidth = 'standard' | 'wide' | 'full';
export type NavStyle = 'topbar' | 'sidebar';
export type SurfaceStyle = 'clean' | 'glass' | 'bordered';

export interface LayoutConfig {
  density: LayoutDensity;
  width: LayoutWidth;
  navStyle: NavStyle;
  surfaceStyle: SurfaceStyle;
}

const DEFAULT_CONFIG: LayoutConfig = {
  density: 'comfortable',
  width: 'wide',
  navStyle: 'topbar',
  surfaceStyle: 'glass',
};

interface LayoutContextType {
  config: LayoutConfig;
  updateConfig: (patch: Partial<LayoutConfig>) => void;
  resetConfig: () => void;
}

const LayoutContext = React.createContext<LayoutContextType>({
  config: DEFAULT_CONFIG,
  updateConfig: () => {},
  resetConfig: () => {},
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = React.useState<LayoutConfig>(DEFAULT_CONFIG);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ecosystem-layout-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }, []);

  const updateConfig = (patch: Partial<LayoutConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem('ecosystem-layout-config', JSON.stringify(next));
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-density', next.density);
          document.documentElement.setAttribute('data-layout-width', next.width);
          document.documentElement.setAttribute('data-surface-style', next.surfaceStyle);
        }
      } catch (e) {
        // Ignore storage errors
      }
      return next;
    });
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem('ecosystem-layout-config');
      if (typeof document !== 'undefined') {
        document.documentElement.removeAttribute('data-density');
        document.documentElement.removeAttribute('data-layout-width');
        document.documentElement.removeAttribute('data-surface-style');
      }
    } catch (e) {}
  };

  return (
    <LayoutContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return React.useContext(LayoutContext);
}

export interface LayoutManagerProps {
  className?: string;
}

export function LayoutManager({ className }: LayoutManagerProps) {
  const { config, updateConfig, resetConfig } = useLayout();

  return (
    <div className={cn('flex flex-col gap-4 p-4 rounded-xl border border-[--border] bg-[--surface]', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[--text]">Layout & Workspace Controls</h3>
          <p className="text-xs text-[--text-muted]">Customize workspace density, width, and surface treatments</p>
        </div>
        <button
          onClick={resetConfig}
          className="text-xs text-[--text-muted] hover:text-[--primary] transition-colors underline"
        >
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Density Control */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-[--border]/60 bg-[--bg]/50">
          <label className="text-xs font-medium text-[--text]">Density</label>
          <div className="grid grid-cols-3 gap-1">
            {(['compact', 'comfortable', 'spacious'] as LayoutDensity[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => updateConfig({ density: d })}
                className={cn(
                  'px-2 py-1.5 rounded text-xs font-medium capitalize transition-all border',
                  config.density === d
                    ? 'bg-[--primary] text-white border-[--primary]'
                    : 'bg-[--surface] text-[--text-muted] border-[--border] hover:text-[--text]',
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Container Width */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-[--border]/60 bg-[--bg]/50">
          <label className="text-xs font-medium text-[--text]">Canvas Width</label>
          <div className="grid grid-cols-3 gap-1">
            {(['standard', 'wide', 'full'] as LayoutWidth[]).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => updateConfig({ width: w })}
                className={cn(
                  'px-2 py-1.5 rounded text-xs font-medium capitalize transition-all border',
                  config.width === w
                    ? 'bg-[--primary] text-white border-[--primary]'
                    : 'bg-[--surface] text-[--text-muted] border-[--border] hover:text-[--text]',
                )}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* Surface Material */}
        <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-[--border]/60 bg-[--bg]/50">
          <label className="text-xs font-medium text-[--text]">Surface Styling</label>
          <div className="grid grid-cols-3 gap-1">
            {(['clean', 'glass', 'bordered'] as SurfaceStyle[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateConfig({ surfaceStyle: s })}
                className={cn(
                  'px-2 py-1.5 rounded text-xs font-medium capitalize transition-all border',
                  config.surfaceStyle === s
                    ? 'bg-[--primary] text-white border-[--primary]'
                    : 'bg-[--surface] text-[--text-muted] border-[--border] hover:text-[--text]',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
