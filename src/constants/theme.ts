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
  background: '#1A1612',
  surface: '#231F1A',
  surfaceElevated: '#2C2720',
  card: '#231F1A',
  border: '#3A342C',
  borderLight: '#2C2720',
  primary: '#F0EAE2',
  primarySoft: 'rgba(240, 234, 226, 0.1)',
  onPrimary: '#1A1612',
  white: '#ffffff',
  textPrimary: '#F0EAE2',
  textSecondary: '#A09888',
  textMuted: '#6B6058',
  textTertiary: '#3A342C',
  overlay: 'rgba(0, 0, 0, 0.5)',
  success: '#34C759',
  warning: '#EDC587',
  error: '#FF6B6B',
  gradient: ['#231F1A', '#2C2720'],
  accent: '#DEB288',
  accentSoft: 'rgba(222, 178, 136, 0.15)',
  accentBright: '#EDC587',
  inputBg: '#231F1A',
  tabBg: 'rgba(26, 22, 18, 0.94)',
  glass: 'rgba(26, 22, 18, 0.92)',
  glassLight: 'rgba(255, 255, 255, 0.05)',
  coolSlate: '#A09888',
  buttonPrimary: '#DEB288',
  buttonPrimaryText: '#1A1612',
  buttonSecondary: '#2C2720',
  buttonSecondaryText: '#F0EAE2',
  surfaceHover: '#3A342C',
  separator: '#2C2720',
  groupedBackground: '#1A1612',
  star: '#EDC587',
};

export const LightColors: AppColors = {
  background: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E8E0D8',
  borderLight: '#F0EBE5',
  primary: '#2C2218',
  primarySoft: 'rgba(44, 34, 24, 0.06)',
  onPrimary: '#FFFFFF',
  white: '#ffffff',
  textPrimary: '#2C2218',
  textSecondary: '#8A7E72',
  textMuted: '#B5ADA5',
  textTertiary: '#D8D0C8',
  overlay: 'rgba(0, 0, 0, 0.3)',
  success: '#34C759',
  warning: '#CE9A7E',
  error: '#E85D5D',
  gradient: ['#FFFFFF', '#FAF8F5'],
  accent: '#CE9A7E',
  accentSoft: 'rgba(206, 154, 126, 0.1)',
  accentBright: '#B8845E',
  inputBg: '#F5F0EB',
  tabBg: 'rgba(250, 248, 245, 0.94)',
  glass: 'rgba(250, 248, 245, 0.92)',
  glassLight: 'rgba(0, 0, 0, 0.03)',
  coolSlate: '#8A7E72',
  buttonPrimary: '#CE9A7E',
  buttonPrimaryText: '#FFFFFF',
  buttonSecondary: '#F0EBE5',
  buttonSecondaryText: '#2C2218',
  surfaceHover: '#F5F0EB',
  separator: '#E8E0D8',
  groupedBackground: '#F5F0EB',
  star: '#CE9A7E',
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
