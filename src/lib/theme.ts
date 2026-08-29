import {
  DarkTheme as NavDark,
  DefaultTheme as NavLight,
  type Theme,
} from '@react-navigation/native';
import { Platform } from 'react-native';

/**
 * Palette values here mirror the semantic tokens in `tailwind.config.js`.
 * Screens style themselves with Tailwind classes; these constants exist for
 * the handful of places that take a plain colour prop — React Navigation's
 * theme, the tab bar, and the status bar.
 */
export const palette = {
  light: {
    canvas: '#ffffff',
    surface: '#f4f4f5',
    line: '#e4e4e7',
    ink: '#18181b',
    muted: '#71717a',
    accent: '#2f6f4e',
    danger: '#a33a3a',
  },
  dark: {
    canvas: '#0b0b0e',
    surface: '#17171b',
    line: '#27272b',
    ink: '#fafafa',
    muted: '#8b8b94',
    accent: '#4ea87b',
    danger: '#e07a7a',
  },
} as const;

export type Palette = (typeof palette)['light'];

export function navigationTheme(scheme: 'light' | 'dark'): Theme {
  const c = palette[scheme];
  const base = scheme === 'dark' ? NavDark : NavLight;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.accent,
      background: c.canvas,
      card: c.canvas,
      text: c.ink,
      border: c.line,
      notification: c.danger,
    },
  };
}

/**
 * Monospaced face for the big readout, so digits keep a fixed width and the
 * numbers stop jittering as they tick over.
 */
export const monoFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});
