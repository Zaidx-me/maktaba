export interface AppColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  card: string;
  border: string;
  borderLight: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  white: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  overlay: string;
  success: string;
  warning: string;
  error: string;
  gradient: [string, string];
  accent: string;
  inputBg: string;
  tabBg: string;
  glass: string;
  glassLight: string;
  coolSlate: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;

  // New Apple-inspired tokens
  surfaceHover: string;
  textTertiary: string;
  accentSoft: string;
  accentBright: string;
}

export const DarkColors: AppColors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  card: '#1C1C1E',
  border: '#38383A',
  borderLight: '#2C2C2E',
  primary: '#F5F5F7',
  primarySoft: 'rgba(245, 245, 247, 0.12)',
  onPrimary: '#000000',
  white: '#ffffff',
  textPrimary: '#F5F5F7',
  textSecondary: '#98989D',
  textMuted: '#636366',
  overlay: 'rgba(0, 0, 0, 0.7)',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  gradient: ['#1C1C1E', '#2C2C2E'],
  accent: '#5E5CE6',
  inputBg: '#1C1C1E',
  tabBg: 'rgba(0, 0, 0, 0.92)',
  glass: 'rgba(0, 0, 0, 0.92)',
  glassLight: 'rgba(255, 255, 255, 0.08)',
  coolSlate: '#98989D',
  buttonPrimary: '#5E5CE6',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#2C2C2E',
  buttonSecondaryText: '#F5F5F7',
  // New tokens
  surfaceHover: '#3A3A3C',
  textTertiary: '#636366',
  accentSoft: 'rgba(94, 92, 230, 0.16)',
  accentBright: '#5E5CE6',
};

export const LightColors: AppColors = {
  background: '#FFFFFF',
  surface: '#F5F5F7',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E5E5EA',
  borderLight: '#F5F5F7',
  primary: '#1D1D1F',
  primarySoft: 'rgba(29, 29, 31, 0.08)',
  onPrimary: '#FFFFFF',
  white: '#ffffff',
  textPrimary: '#1D1D1F',
  textSecondary: '#86868B',
  textMuted: '#AEAEB2',
  overlay: 'rgba(0, 0, 0, 0.4)',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  gradient: ['#F5F5F7', '#FFFFFF'],
  accent: '#5856D6',
  inputBg: '#F5F5F7',
  tabBg: 'rgba(255, 255, 255, 0.92)',
  glass: 'rgba(255, 255, 255, 0.92)',
  glassLight: 'rgba(0, 0, 0, 0.04)',
  coolSlate: '#86868B',
  buttonPrimary: '#5856D6',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#F5F5F7',
  buttonSecondaryText: '#1D1D1F',
  // New tokens
  surfaceHover: '#EBEBED',
  textTertiary: '#AEAEB2',
  accentSoft: 'rgba(88, 86, 214, 0.12)',
  accentBright: '#5856D6',
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  sectionSm: 48,
  section: 64,
  sectionLg: 78,
  hero: 120,
  huge: 48,
} as const;

export const FontSize = {
  micro: 10,
  xs: 11,
  sm: 12,
  caption: 13,
  captionBold: 13,
  bodySm: 13,
  bodySmMedium: 14,
  bodyMd: 15,
  bodyMdMedium: 16,
  subtitle: 16,
  heading5: 17,
  heading4: 20,
  heading3: 22,
  heading2: 28,
  heading1: 34,
  displayLg: 40,
  heroDisplay: 48,
  md: 16,
  lg: 16,
  xl: 20,
  xxl: 24,
  title: 24,
  hero: 48,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
  },
} as const;

export const Elevation = {
  flat: { shadowOpacity: 0 },
  subtle: { shadowOpacity: 0 },
  card: { shadowOpacity: 0 },
  mockup: { shadowOpacity: 0 },
  modal: { shadowOpacity: 0 },
} as const;

export const Colors = DarkColors;
