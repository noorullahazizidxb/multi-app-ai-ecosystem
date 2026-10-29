import { ThemePreset, THEME_PRESETS } from './presets';

/**
 * Generate CSS custom properties for a single theme preset.
 */
export function generateThemeCSS(preset: ThemePreset): string {
  return `[data-theme="${preset.id}"] {
  --bg: ${preset.colors.bg};
  --primary: ${preset.colors.primary};
  --accent: ${preset.colors.accent};
  --surface: ${preset.colors.surface};
  --text: ${preset.colors.text};
  --text-muted: ${preset.colors.textMuted};
  --border: ${preset.colors.border};
  --error: ${preset.colors.error};
  --success: ${preset.colors.success};
  --warning: ${preset.colors.warning};
}`;
}

/**
 * Generate the complete theme.css file with all 10 presets and Tailwind v4 @theme integration.
 */
export function generateAllThemesCSS(): string {
  const header = `/* ============================================
 * @repo/theme-engine — Auto-generated Theme CSS
 * 10 OKLCH Presets for Tailwind CSS v4
 * DO NOT EDIT MANUALLY — regenerate with: pnpm --filter @repo/theme-engine build
 * ============================================ */

@theme {
  --color-bg: var(--bg);
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  --color-surface: var(--surface);
  --color-text: var(--text);
  --color-text-muted: var(--text-muted);
  --color-border: var(--border);
  --color-error: var(--error);
  --color-success: var(--success);
  --color-warning: var(--warning);
}

`;

  const themes = THEME_PRESETS.map((preset) => generateThemeCSS(preset)).join('\n\n');

  return header + themes + '\n';
}
