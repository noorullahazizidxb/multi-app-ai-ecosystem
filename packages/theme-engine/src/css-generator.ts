import { ThemePreset, THEME_PRESETS } from './presets';

const presetSelector = (preset: ThemePreset): string => `[data-theme="${preset.id}"]`;

/**
 * Generate CSS custom properties for a single theme preset.
 */
export function generateThemeCSS(preset: ThemePreset): string {
  return `${presetSelector(preset)} {
  color-scheme: ${preset.scheme};
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
 * Bind Tailwind's `dark:` variant to the dark presets (instead of the OS preference),
 * so `dark:` utilities follow the active `data-theme` at runtime.
 */
function generateDarkVariantCSS(presets: readonly ThemePreset[]): string {
  const selectors = presets
    .filter((preset) => preset.scheme === 'dark')
    .flatMap((preset) => [presetSelector(preset), `${presetSelector(preset)} *`]);

  return `@custom-variant dark (&:where(${selectors.join(', ')}));`;
}

/**
 * Generate the complete theme.css file with all presets and the Tailwind CSS v4 integration
 * (`@theme inline` color tokens and the preset-driven `dark:` variant).
 */
export function generateAllThemesCSS(): string {
  const header = `/* ============================================
 * @repo/theme-engine — Auto-generated Theme CSS
 * ${THEME_PRESETS.length} OKLCH Presets for Tailwind CSS v4
 * DO NOT EDIT MANUALLY — regenerate with: pnpm --filter @repo/theme-engine generate:css
 * ============================================ */

@theme inline {
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

${generateDarkVariantCSS(THEME_PRESETS)}

`;

  const themes = THEME_PRESETS.map((preset) => generateThemeCSS(preset)).join('\n\n');

  return header + themes + '\n';
}
