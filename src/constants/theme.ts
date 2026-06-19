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
  background: '#1C1C1E',
  surface: '#2C2C2E',
  surfaceElevated: '#3A3A3C',
  card: '#2C2C2E',
  border: '#48484A',
  borderLight: '#3A3A3C',
  primary: '#F2F2F7',
  primarySoft: 'rgba(242, 242, 247, 0.12)',
  onPrimary: '#1C1C1E',
  white: '#ffffff',
  textPrimary: '#F2F2F7',
  textSecondary: '#8E8E93',
  textMuted: '#636366',
  textTertiary: '#48484A',
  overlay: 'rgba(0, 0, 0, 0.5)',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  gradient: ['#2C2C2E', '#3A3A3C'],
  accent: '#5E5CE6',
  accentSoft: 'rgba(94, 92, 230, 0.18)',
  accentBright: '#7D7AFF',
  inputBg: '#2C2C2E',
  tabBg: 'rgba(28, 28, 30, 0.92)',
  glass: 'rgba(28, 28, 30, 0.88)',
  glassLight: 'rgba(255, 255, 255, 0.06)',
  coolSlate: '#8E8E93',
  buttonPrimary: '#5E5CE6',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#3A3A3C',
  buttonSecondaryText: '#F2F2F7',
  surfaceHover: '#48484A',
  separator: '#38383A',
  groupedBackground: '#1C1C1E',
  star: '#FF9F0A',
};

export const LightColors: AppColors = {
  background: '#FFFFFF',
  surface: '#F2F2F7',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  primary: '#1C1C1E',
  primarySoft: 'rgba(28, 28, 30, 0.08)',
  onPrimary: '#FFFFFF',
  white: '#ffffff',
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  textMuted: '#AEAEB2',
  textTertiary: '#C7C7CC',
  overlay: 'rgba(0, 0, 0, 0.3)',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  gradient: ['#F2F2F7', '#FFFFFF'],
  accent: '#007AFF',
  accentSoft: 'rgba(0, 122, 255, 0.12)',
  accentBright: '#0A84FF',
  inputBg: '#F2F2F7',
  tabBg: 'rgba(255, 255, 255, 0.92)',
  glass: 'rgba(249, 249, 249, 0.94)',
  glassLight: 'rgba(0, 0, 0, 0.04)',
  coolSlate: '#8E8E93',
  buttonPrimary: '#007AFF',
  buttonPrimaryText: '#ffffff',
  buttonSecondary: '#F2F2F7',
  buttonSecondaryText: '#1C1C1E',
  surfaceHover: '#E5E5EA',
  separator: '#E5E5EA',
  groupedBackground: '#F2F2F7',
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
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
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
