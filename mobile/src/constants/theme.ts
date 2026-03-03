/**
 * Theme colors derived from original HSL CSS variables.
 * Light and dark palettes for React Native.
 */
export const colors = {
  light: {
    background: 'hsl(210, 20%, 98%)',
    foreground: 'hsl(222, 47%, 11%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(222, 47%, 11%)',
    primary: 'hsl(245, 58%, 51%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    secondary: 'hsl(210, 40%, 96%)',
    secondaryForeground: 'hsl(222, 47%, 11%)',
    muted: 'hsl(210, 40%, 96%)',
    mutedForeground: 'hsl(215, 16%, 47%)',
    border: 'hsl(214, 32%, 91%)',
    input: 'hsl(214, 32%, 91%)',
    ring: 'hsl(245, 58%, 51%)',
    destructive: 'hsl(0, 84%, 60%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',
    success: 'hsl(142, 71%, 45%)',
    warning: 'hsl(38, 92%, 50%)',
    aiGlow: 'hsl(275, 80%, 60%)',
    aiGlowLight: 'hsla(275, 80%, 60%, 0.15)',
    primaryLight: 'hsla(245, 58%, 51%, 0.1)',
    successLight: 'hsla(142, 71%, 45%, 0.1)',
    destructiveLight: 'hsla(0, 84%, 60%, 0.1)',
  },
  dark: {
    background: 'hsl(224, 30%, 8%)',
    foreground: 'hsl(210, 40%, 96%)',
    card: 'hsl(224, 30%, 12%)',
    cardForeground: 'hsl(210, 40%, 96%)',
    primary: 'hsl(245, 58%, 61%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    secondary: 'hsl(224, 20%, 18%)',
    secondaryForeground: 'hsl(210, 40%, 96%)',
    muted: 'hsl(224, 20%, 18%)',
    mutedForeground: 'hsl(215, 20%, 65%)',
    border: 'hsl(224, 20%, 20%)',
    input: 'hsl(224, 20%, 20%)',
    ring: 'hsl(245, 58%, 61%)',
    destructive: 'hsl(0, 63%, 31%)',
    destructiveForeground: 'hsl(210, 40%, 98%)',
    success: 'hsl(142, 71%, 40%)',
    warning: 'hsl(38, 92%, 45%)',
    aiGlow: 'hsl(275, 80%, 70%)',
    aiGlowLight: 'hsla(275, 80%, 70%, 0.2)',
    primaryLight: 'hsla(245, 58%, 61%, 0.15)',
    successLight: 'hsla(142, 71%, 40%, 0.15)',
    destructiveLight: 'hsla(0, 63%, 31%, 0.2)',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  '3xl': 24,
  '5xl': 48,
};
