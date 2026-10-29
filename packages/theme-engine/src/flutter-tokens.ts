import { ThemePreset, THEME_PRESETS } from './presets';

/**
 * Convert an OKLCH string to a Flutter-compatible hex color.
 * This is a simplified conversion — production would use proper OKLCH→sRGB conversion.
 * For Flutter, we export the raw OKLCH values and let flutter_core handle conversion.
 */
export interface FlutterThemeToken {
  id: string;
  name: string;
  persona: string;
  defaultFor: string;
  colors: Record<string, string>;
}

export function generateFlutterTokens(): FlutterThemeToken[] {
  return THEME_PRESETS.map((preset) => ({
    id: preset.id,
    name: preset.name,
    persona: preset.persona,
    defaultFor: preset.defaultFor,
    colors: { ...preset.colors },
  }));
}

export function generateFlutterTokensJSON(): string {
  return JSON.stringify(generateFlutterTokens(), null, 2);
}
