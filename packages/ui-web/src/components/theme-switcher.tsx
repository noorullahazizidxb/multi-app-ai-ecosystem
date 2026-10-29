'use client';

import * as React from 'react';
import { cn } from '../lib/utils';

export interface ThemePresetOption {
  id: string;
  name: string;
  persona: string;
  previewColor: string;
  defaultFor: string;
}

export const PRESET_OPTIONS: ThemePresetOption[] = [
  { id: 'clean-slate', name: 'Clean Slate', persona: 'Executive Daylight', previewColor: '#7c6ef0', defaultFor: 'CareerForge' },
  { id: 'obsidian-gold', name: 'Obsidian Gold', persona: 'Luxury Dark Mode', previewColor: '#c9a84c', defaultFor: 'FreelanceOS' },
  { id: 'cyber-neon', name: 'Cyber Neon', persona: 'High-Energy Dark', previewColor: '#00e68a', defaultFor: 'KineticAI' },
  { id: 'synthwave-sunset', name: 'Synthwave Sunset', persona: 'Creator Studio Dark', previewColor: '#e040a0', defaultFor: 'ViralMatrix' },
  { id: 'nord-frost', name: 'Nord Frost', persona: 'Arctic Minimal Dark', previewColor: '#88c0d0', defaultFor: 'All Apps' },
  { id: 'matcha-forest', name: 'Matcha Forest', persona: 'Organic Calm Light', previewColor: '#4a8c5c', defaultFor: 'All Apps' },
  { id: 'solarized-warm', name: 'Solarized Warm', persona: 'Low-Eye-Strain Cream', previewColor: '#b58900', defaultFor: 'All Apps' },
  { id: 'crimson-executive', name: 'Crimson Executive', persona: 'High-Contrast Onyx', previewColor: '#dc2626', defaultFor: 'All Apps' },
  { id: 'ocean-abyss', name: 'Ocean Abyss', persona: 'Deep Maritime Blue', previewColor: '#2596be', defaultFor: 'All Apps' },
  { id: 'rose-quartz', name: 'Rose Quartz', persona: 'Modern Pastel Light', previewColor: '#e07098', defaultFor: 'All Apps' },
];

export interface ThemeSwitcherProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
  className?: string;
}

export function ThemeSwitcher({
  currentTheme = 'clean-slate',
  onThemeChange,
  className,
}: ThemeSwitcherProps) {
  const [selected, setSelected] = React.useState(currentTheme);

  const applyTheme = (themeId: string) => {
    setSelected(themeId);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', themeId);
      localStorage.setItem('app-theme-preset', themeId);
    }
    onThemeChange?.(themeId);
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-theme-preset');
      if (saved && saved !== selected) {
        applyTheme(saved);
      }
    }
  }, []);

  return (
    <div className={cn('flex flex-col gap-3 p-4 rounded-xl border border-[--border] bg-[--surface]', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[--text]">Theme Persona</span>
        <span className="text-xs text-[--text-muted]">10 OKLCH Presets</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PRESET_OPTIONS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyTheme(preset.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-2 rounded-lg border text-left transition-all cursor-pointer',
              selected === preset.id
                ? 'border-[--primary] ring-2 ring-[--primary]/20 bg-[--bg]'
                : 'border-[--border] hover:bg-[--bg]',
            )}
            title={`${preset.name} - ${preset.persona}`}
          >
            <div
              className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: preset.previewColor }}
            />
            <span className="text-xs font-medium text-[--text] truncate w-full text-center">
              {preset.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

