export interface ThemePreset {
  id: string;
  name: string;
  persona: string;
  defaultFor: string;
  colors: {
    bg: string;
    primary: string;
    accent: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
}

export const THEME_PRESETS: readonly ThemePreset[] = [
  {
    id: 'clean-slate',
    name: 'Clean Slate',
    persona: 'Executive Daylight',
    defaultFor: 'careerforge',
    colors: {
      bg: 'oklch(0.98 0.005 240)',
      primary: 'oklch(0.55 0.22 260)',
      accent: 'oklch(0.65 0.18 200)',
      surface: 'oklch(0.96 0.003 240)',
      text: 'oklch(0.15 0.01 260)',
      textMuted: 'oklch(0.45 0.02 260)',
      border: 'oklch(0.88 0.01 240)',
      error: 'oklch(0.55 0.22 25)',
      success: 'oklch(0.60 0.18 145)',
      warning: 'oklch(0.72 0.16 85)',
    },
  },
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    persona: 'Luxury Dark Mode',
    defaultFor: 'freelanceos',
    colors: {
      bg: 'oklch(0.12 0.010 260)',
      primary: 'oklch(0.78 0.16 85)',
      accent: 'oklch(0.65 0.14 70)',
      surface: 'oklch(0.16 0.008 260)',
      text: 'oklch(0.92 0.005 85)',
      textMuted: 'oklch(0.60 0.02 85)',
      border: 'oklch(0.25 0.01 260)',
      error: 'oklch(0.60 0.20 25)',
      success: 'oklch(0.65 0.18 145)',
      warning: 'oklch(0.72 0.16 85)',
    },
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    persona: 'High-Energy Dark',
    defaultFor: 'kinetic',
    colors: {
      bg: 'oklch(0.10 0.020 280)',
      primary: 'oklch(0.80 0.25 155)',
      accent: 'oklch(0.70 0.28 330)',
      surface: 'oklch(0.14 0.015 280)',
      text: 'oklch(0.93 0.005 155)',
      textMuted: 'oklch(0.60 0.03 155)',
      border: 'oklch(0.22 0.02 280)',
      error: 'oklch(0.60 0.25 25)',
      success: 'oklch(0.70 0.22 145)',
      warning: 'oklch(0.75 0.20 85)',
    },
  },
  {
    id: 'synthwave-sunset',
    name: 'Synthwave Sunset',
    persona: 'Creator Studio Dark',
    defaultFor: 'viralmatrix',
    colors: {
      bg: 'oklch(0.16 0.060 300)',
      primary: 'oklch(0.70 0.26 350)',
      accent: 'oklch(0.78 0.20 60)',
      surface: 'oklch(0.20 0.045 300)',
      text: 'oklch(0.94 0.01 350)',
      textMuted: 'oklch(0.65 0.03 350)',
      border: 'oklch(0.28 0.04 300)',
      error: 'oklch(0.58 0.22 25)',
      success: 'oklch(0.65 0.18 145)',
      warning: 'oklch(0.72 0.18 60)',
    },
  },
  {
    id: 'nord-frost',
    name: 'Nord Frost',
    persona: 'Arctic Minimal Dark',
    defaultFor: 'all',
    colors: {
      bg: 'oklch(0.29 0.030 250)',
      primary: 'oklch(0.72 0.10 215)',
      accent: 'oklch(0.65 0.12 240)',
      surface: 'oklch(0.33 0.025 250)',
      text: 'oklch(0.92 0.01 215)',
      textMuted: 'oklch(0.65 0.02 215)',
      border: 'oklch(0.38 0.02 250)',
      error: 'oklch(0.60 0.18 15)',
      success: 'oklch(0.65 0.15 145)',
      warning: 'oklch(0.70 0.14 85)',
    },
  },
  {
    id: 'matcha-forest',
    name: 'Matcha Forest',
    persona: 'Organic Calm Light',
    defaultFor: 'all',
    colors: {
      bg: 'oklch(0.96 0.020 130)',
      primary: 'oklch(0.52 0.14 145)',
      accent: 'oklch(0.68 0.12 95)',
      surface: 'oklch(0.94 0.015 130)',
      text: 'oklch(0.18 0.02 145)',
      textMuted: 'oklch(0.42 0.03 145)',
      border: 'oklch(0.85 0.02 130)',
      error: 'oklch(0.55 0.20 25)',
      success: 'oklch(0.58 0.16 145)',
      warning: 'oklch(0.70 0.14 85)',
    },
  },
  {
    id: 'solarized-warm',
    name: 'Solarized Warm',
    persona: 'Low-Eye-Strain Cream',
    defaultFor: 'all',
    colors: {
      bg: 'oklch(0.95 0.035 85)',
      primary: 'oklch(0.58 0.16 45)',
      accent: 'oklch(0.55 0.15 195)',
      surface: 'oklch(0.93 0.025 85)',
      text: 'oklch(0.20 0.02 45)',
      textMuted: 'oklch(0.45 0.03 45)',
      border: 'oklch(0.85 0.03 85)',
      error: 'oklch(0.55 0.20 25)',
      success: 'oklch(0.60 0.16 145)',
      warning: 'oklch(0.68 0.15 85)',
    },
  },
  {
    id: 'crimson-executive',
    name: 'Crimson Executive',
    persona: 'High-Contrast Onyx',
    defaultFor: 'all',
    colors: {
      bg: 'oklch(0.14 0.015 20)',
      primary: 'oklch(0.60 0.23 25)',
      accent: 'oklch(0.75 0.12 50)',
      surface: 'oklch(0.18 0.012 20)',
      text: 'oklch(0.93 0.005 25)',
      textMuted: 'oklch(0.60 0.02 25)',
      border: 'oklch(0.26 0.01 20)',
      error: 'oklch(0.55 0.22 15)',
      success: 'oklch(0.62 0.18 145)',
      warning: 'oklch(0.70 0.16 60)',
    },
  },
  {
    id: 'ocean-abyss',
    name: 'Ocean Abyss',
    persona: 'Deep Maritime Blue',
    defaultFor: 'all',
    colors: {
      bg: 'oklch(0.13 0.040 245)',
      primary: 'oklch(0.68 0.18 210)',
      accent: 'oklch(0.75 0.16 175)',
      surface: 'oklch(0.17 0.030 245)',
      text: 'oklch(0.92 0.01 210)',
      textMuted: 'oklch(0.60 0.03 210)',
      border: 'oklch(0.24 0.03 245)',
      error: 'oklch(0.58 0.20 25)',
      success: 'oklch(0.65 0.16 160)',
      warning: 'oklch(0.70 0.15 85)',
    },
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    persona: 'Modern Pastel Light',
    defaultFor: 'all',
    colors: {
      bg: 'oklch(0.97 0.015 350)',
      primary: 'oklch(0.62 0.19 355)',
      accent: 'oklch(0.70 0.14 320)',
      surface: 'oklch(0.95 0.012 350)',
      text: 'oklch(0.18 0.02 355)',
      textMuted: 'oklch(0.45 0.03 355)',
      border: 'oklch(0.88 0.015 350)',
      error: 'oklch(0.55 0.22 15)',
      success: 'oklch(0.62 0.16 145)',
      warning: 'oklch(0.70 0.15 85)',
    },
  },
] as const;

export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id);
}

export function getDefaultPresetForApp(appId: string): ThemePreset {
  return THEME_PRESETS.find((p) => p.defaultFor === appId) || THEME_PRESETS[0];
}

export function getPresetIds(): string[] {
  return THEME_PRESETS.map((p) => p.id);
}
