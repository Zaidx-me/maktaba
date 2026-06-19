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
  textTertiary: string;
  overlay: string;
  success: string;
  warning: string;
  error: string;
  gradient: [string, string];
  accent: string;
  accentSoft: string;
  accentBright: string;
  inputBg: string;
  tabBg: string;
  glass: string;
  glassLight: string;
  coolSlate: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  surfaceHover: string;
  separator: string;
  groupedBackground: string;
  star: string;
}

export const DarkColors: AppColors = {
  background: '#111111',
  surface: '#1C1C1C',
  surfaceElevated: '#262626',
  card: '#1C1C1C',
  border: '#2A2A2A',
  borderLight: '#222222',
  primary: '#F0F0F0',
  primarySoft: 'rgba(240, 240, 240, 0.1)',
  onPrimary: '#111111',
  white: '#ffffff',
  textPrimary: '#F0F0F0',
  textSecondary: '#888888',
  textMuted: '#555555',
  textTertiary: '#3A3A3A',
  overlay: 'rgba(0, 0, 0, 0.5)',
  success: '#34C759',
  warning: '#FF9F0A',
  error: '#FF453A',
  gradient: ['#1C1C1C', '#262626'],
  accent: '#6C63FF',
  accentSoft: 'rgba(108, 99, 255, 0.12)',
  accentBright: '#8B83FF',
  inputBg: '#1C1C1C',
  tabBg: 'rgba(17, 17, 17, 0.94)',
  glass: 'rgba(17, 17, 17, 0.92)',
  glassLight: 'rgba(255, 255, 255, 0.05)',
  coolSlate: '#888888',
  buttonPrimary: '#6C63FF',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#262626',
  buttonSecondaryText: '#F0F0F0',
  surfaceHover: '#333333',
  separator: '#222222',
  groupedBackground: '#111111',
  star: '#FF9F0A',
};

export const LightColors: AppColors = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8E8E8',
  borderLight: '#F0F0F0',
  primary: '#1A1A1A',
  primarySoft: 'rgba(26, 26, 26, 0.06)',
  onPrimary: '#FFFFFF',
  white: '#ffffff',
  textPrimary: '#1A1A1A',
  textSecondary: '#777777',
  textMuted: '#AAAAAA',
  textTertiary: '#D0D0D0',
  overlay: 'rgba(0, 0, 0, 0.3)',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  gradient: ['#FFFFFF', '#F5F5F5'],
  accent: '#6C63FF',
  accentSoft: 'rgba(108, 99, 255, 0.08)',
  accentBright: '#5B52E0',
  inputBg: '#F0F0F0',
  tabBg: 'rgba(250, 250, 250, 0.94)',
  glass: 'rgba(250, 250, 250, 0.92)',
  glassLight: 'rgba(0, 0, 0, 0.03)',
  coolSlate: '#777777',
  buttonPrimary: '#6C63FF',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#F0F0F0',
  buttonSecondaryText: '#1A1A1A',
  surfaceHover: '#F0F0F0',
  separator: '#E8E8E8',
  groupedBackground: '#F5F5F5',
  star: '#FF9500',
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
  lg: 14,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
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
