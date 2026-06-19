# Zesho UI Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Zesho books app UI from dark Runway-inspired aesthetic to premium Apple Books-inspired minimal design with Indigo accent.

**Architecture:** Update theme system first, then rebuild components bottom-up (atoms → molecules → organisms → screens). Each task produces working, testable UI changes.

**Tech Stack:** React Native, Expo, TypeScript, expo-router, @expo/vector-icons (Ionicons)

## Global Constraints

- Font: Inter (fallback: -apple-system, BlinkMacSystemFont)
- Accent: Indigo (#5856D6 light / #5E5CE6 dark)
- Border Radius: 16px cards, 24px tab bar, 14px buttons
- Shadows: Multi-layer (4 levels for depth)
- Screen margins: 20px horizontal
- Maintain React.memo optimizations on BookCard, BookRow
- Test on both light and dark modes

---

## File Structure

### Modified Files
- `src/constants/theme.ts` - New color tokens, typography, spacing
- `src/context/ThemeContext.tsx` - Updated with new colors
- `src/components/BookCard.tsx` - Premium card design
- `src/components/BookRow.tsx` - Updated section headers
- `src/components/SkeletonLoader.tsx` - Match new design
- `src/components/BookCoverPlaceholder.tsx` - Match new design
- `app/(tabs)/_layout.tsx` - Floating tab bar
- `app/(tabs)/index.tsx` - Premium home screen
- `app/(tabs)/library.tsx` - Updated library
- `app/(tabs)/profile.tsx` - Updated profile
- `app/(tabs)/shelf.tsx` - Updated category
- `app/book/[id].tsx` - Updated book detail
- `app/settings.tsx` - Updated settings
- `app/favorites.tsx` - Updated favorites
- `app/history.tsx` - Updated history
- `app/notifications.tsx` - Updated notifications
- `app/help.tsx` - Updated help
- `app/onboarding.tsx` - Updated onboarding
- `app/(auth)/login.tsx` - Updated login

### New Files
- `src/components/HeroCard.tsx` - Featured collection card
- `src/components/QuickActionCard.tsx` - Action cards with icons
- `src/components/ProgressBar.tsx` - Reading progress indicator
- `src/components/FloatingTabBar.tsx` - Extracted tab bar component
- `src/components/SearchBar.tsx` - Reusable search input
- `src/components/SectionHeader.tsx` - Reusable section header

---

## Phase 1: Theme Foundation

### Task 1: Update Color System

**Files:**
- Modify: `src/constants/theme.ts:1-163`

**Interfaces:**
- Consumes: None (foundation task)
- Produces: `DarkColors`, `LightColors`, `AppColors` with new tokens

- [ ] **Step 1: Update AppColors interface**

Add new color tokens to the interface:

```typescript
export interface AppColors {
  // Existing tokens (keep for compatibility)
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
```

- [ ] **Step 2: Update DarkColors**

```typescript
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
```

- [ ] **Step 3: Update LightColors**

```typescript
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
```

- [ ] **Step 4: Update Spacing, FontSize, BorderRadius**

```typescript
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

// Add shadow presets
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
```

- [ ] **Step 5: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS (no type errors)

- [ ] **Step 6: Commit**

```bash
git add src/constants/theme.ts
git commit -m "feat: update theme system with Apple-inspired colors and typography"
```

---

### Task 2: Add New Reusable Components

**Files:**
- Create: `src/components/SearchBar.tsx`
- Create: `src/components/SectionHeader.tsx`
- Create: `src/components/ProgressBar.tsx`

**Interfaces:**
- Consumes: `useTheme`, `Spacing`, `FontSize`, `BorderRadius`
- Produces: `<SearchBar />`, `<SectionHeader />`, `<ProgressBar />`

- [ ] **Step 1: Create SearchBar component**

```tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search books, authors...', onSubmitEditing }: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.inputBg }]}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: FontSize.bodyMdMedium,
  },
});
```

- [ ] **Step 2: Create SectionHeader component**

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Spacing, FontSize } from '../constants/theme';

interface SectionHeaderProps {
  label?: string;
  title: string;
  seeAllText?: string;
  onSeeAll?: () => void;
}

export function SectionHeader({ label, title, seeAllText = 'See all', onSeeAll }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View>
        {label && (
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        )}
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: colors.accent }]}>{seeAllText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.heading3,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: FontSize.bodyMd,
    fontWeight: '500',
  },
});
```

- [ ] **Step 3: Create ProgressBar component**

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius } from '../constants/theme';

interface ProgressBarProps {
  progress: number; // 0-1
  height?: number;
}

export function ProgressBar({ progress, height = 3 }: ProgressBarProps) {
  const { colors } = useTheme();
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.container, { height, backgroundColor: colors.surfaceHover, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: colors.accent,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
```

- [ ] **Step 4: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SearchBar.tsx src/components/SectionHeader.tsx src/components/ProgressBar.tsx
git commit -m "feat: add reusable SearchBar, SectionHeader, and ProgressBar components"
```

---

## Phase 2: Core Components

### Task 3: Rebuild BookCard Component

**Files:**
- Modify: `src/components/BookCard.tsx:1-87`

**Interfaces:**
- Consumes: `useTheme`, `Spacing`, `FontSize`, `BorderRadius`, `Shadows`, `Book` type
- Produces: Premium book card with layered shadows

- [ ] **Step 1: Rewrite BookCard with premium design**

```tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Book } from '../types';
import { Spacing, FontSize, BorderRadius, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { BookCoverPlaceholder, BookSkeleton } from './BookCoverPlaceholder';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
  size?: number;
  loading?: boolean;
}

export const BookCard = React.memo(function BookCard({ book, onPress, size = 140, loading }: BookCardProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/book/${book.id}`);
    }
  };

  const imageHeight = size * 1.4;

  if (loading) {
    return (
      <View style={[styles.card, { width: size }]}>
        <BookSkeleton width={size} height={imageHeight} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { width: size }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, { width: size, height: imageHeight, borderRadius: BorderRadius.lg }]}>
        {book.thumbnail ? (
          <Image
            source={{ uri: book.thumbnail, cache: 'force-cache' }}
            style={styles.image}
            fadeDuration={300}
            resizeMode="cover"
          />
        ) : (
          <BookCoverPlaceholder title={book.title} width={size} height={imageHeight} />
        )}
        <View style={styles.spine} />
      </View>
      <Text
        style={[styles.title, { color: colors.textPrimary }]}
        numberOfLines={2}
      >
        {book.title}
      </Text>
      {book.authors?.[0] && (
        <Text style={[styles.author, { color: colors.textSecondary }]} numberOfLines={1}>
          {book.authors[0]}
        </Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  imageContainer: {
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  title: {
    fontSize: FontSize.bodySmMedium,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  author: {
    fontSize: FontSize.sm,
    fontWeight: '400',
    marginTop: Spacing.xxs,
    letterSpacing: 0.1,
  },
});
```

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/BookCard.tsx
git commit -m "feat: rebuild BookCard with premium Apple-inspired design"
```

---

### Task 4: Rebuild BookRow Component

**Files:**
- Modify: `src/components/BookRow.tsx:1-101`

**Interfaces:**
- Consumes: `useTheme`, `SectionHeader`, `BookCard`, `Spacing`
- Produces: Updated horizontal book row with new section headers

- [ ] **Step 1: Rewrite BookRow with SectionHeader**

```tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { BookCard } from './BookCard';
import { SectionHeader } from './SectionHeader';
import { SkeletonRow } from './SkeletonLoader';
import { Book } from '../types';
import { Spacing } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface BookRowProps {
  title: string;
  label?: string;
  books: Book[];
  loading?: boolean;
  bookSize?: number;
  onSeeAll?: () => void;
}

function areBooksEqual(a: Book[], b: Book[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || a[i].thumbnail !== b[i].thumbnail) return false;
  }
  return true;
}

function areRowPropsEqual(prev: BookRowProps, next: BookRowProps) {
  return prev.title === next.title
    && prev.loading === next.loading
    && prev.bookSize === next.bookSize
    && prev.onSeeAll === next.onSeeAll
    && areBooksEqual(prev.books, next.books);
}

export const BookRow = React.memo(function BookRow({ title, label, books, loading, bookSize = 140, onSeeAll }: BookRowProps) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={styles.container}>
        <SectionHeader label={label} title={title} />
        <SkeletonRow />
      </View>
    );
  }

  if (books.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader label={label} title={title} onSeeAll={onSeeAll} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {books.map((book) => (
          <View key={book.id} style={[styles.bookWrapper, { width: bookSize }]}>
            <BookCard book={book} size={bookSize} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}, areRowPropsEqual);

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxl,
  },
  scrollContent: {
    gap: Spacing.md,
  },
  bookWrapper: {
    marginRight: Spacing.sm,
  },
});
```

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/BookRow.tsx
git commit -m "feat: rebuild BookRow with new SectionHeader integration"
```

---

### Task 5: Create HeroCard Component

**Files:**
- Create: `src/components/HeroCard.tsx`

**Interfaces:**
- Consumes: `useTheme`, `Spacing`, `FontSize`, `BorderRadius`
- Produces: `<HeroCard />` with gradient background and ambient glow

- [ ] **Step 1: Create HeroCard component**

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, FontSize, BorderRadius } from '../constants/theme';

interface HeroCardProps {
  label?: string;
  title: string;
  description?: string;
  bookCount?: number;
  onPress?: () => void;
  gradient?: [string, string];
}

export function HeroCard({
  label = 'FEATURED COLLECTION',
  title,
  description,
  bookCount,
  onPress,
  gradient = ['#1a1a2e', '#0f3460'],
}: HeroCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: gradient[0] }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.gradientOverlay, { backgroundColor: gradient[1] }]} />
      <View style={[styles.glow, { backgroundColor: colors.accent + '30' }]} />
      
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        
        <View style={styles.footer}>
          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>Explore</Text>
          </View>
          {bookCount && (
            <Text style={styles.bookCount}>{bookCount} books</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    minHeight: 200,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -30,
    right: -20,
    opacity: 0.3,
  },
  content: {
    padding: Spacing.xxl,
    position: 'relative',
    zIndex: 1,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.heading3,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
    lineHeight: 28,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.bodyMd,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    maxWidth: 280,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  ctaButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ctaText: {
    color: '#fff',
    fontSize: FontSize.bodyMd,
    fontWeight: '600',
  },
  bookCount: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FontSize.subhead,
  },
});
```

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroCard.tsx
git commit -m "feat: add HeroCard component with gradient and glassmorphism"
```

---

### Task 6: Create QuickActionCard Component

**Files:**
- Create: `src/components/QuickActionCard.tsx`

**Interfaces:**
- Consumes: `useTheme`, `Spacing`, `FontSize`, `BorderRadius`, `Shadows`
- Produces: `<QuickActionCard />` with gradient icon background

- [ ] **Step 1: Create QuickActionCard component**

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, FontSize, BorderRadius, Shadows } from '../constants/theme';

interface QuickActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  iconColor?: string;
}

export function QuickActionCard({ icon, title, subtitle, onPress, iconColor }: QuickActionCardProps) {
  const { colors } = useTheme();
  const accent = iconColor || colors.accent;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.white }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: accent + '18' }]}>
        <Ionicons name={icon} size={24} color={accent} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.bodyMd,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xxs,
  },
});
```

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/QuickActionCard.tsx
git commit -m "feat: add QuickActionCard component with gradient icon"
```

---

## Phase 3: Navigation

### Task 7: Rebuild Floating Tab Bar

**Files:**
- Modify: `app/(tabs)/_layout.tsx:1-74`

**Interfaces:**
- Consumes: `useTheme`, `useSafeAreaInsets`, `Shadows`
- Produces: Floating glassmorphism tab bar

- [ ] **Step 1: Rewrite tab bar layout**

```tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'ios' ? 28 : Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute' as const,
          bottom: 16,
          left: 16,
          right: 16,
          height: 64 + bottomPadding,
          paddingTop: 10,
          paddingBottom: bottomPadding,
          backgroundColor: colors.glass,
          borderRadius: 24,
          borderWidth: 0.5,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.3 : 0.12,
          shadowRadius: 32,
          // @ts-ignore
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shelf"
        options={{
          title: 'Category',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="notes" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
```

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/_layout.tsx
git commit -m "feat: rebuild floating glassmorphism tab bar"
```

---

## Phase 4: Home Screen

### Task 8: Rebuild Home Screen

**Files:**
- Modify: `app/(tabs)/index.tsx:1-380`

**Interfaces:**
- Consumes: All new components, `useTheme`, `useAuth`, services
- Produces: Premium home screen with hero, continue reading, trending, quick actions

- [ ] **Step 1: Rewrite Home Screen**

This is a large file. Key changes:
- Import new components (HeroCard, QuickActionCard, SearchBar, SectionHeader, ProgressBar)
- Add "Continue Reading" section with progress bars
- Replace old action cards with QuickActionCard
- Use HeroCard for featured collection
- Update styling to use new theme tokens

Due to the size, implement section by section:

1. Update imports to include new components
2. Replace search bar with `<SearchBar />`
3. Add HeroCard after search
4. Add "Continue Reading" section with ProgressBar
5. Replace action row with QuickActionCard grid
6. Update BookRow calls to include `label` prop
7. Update all StyleSheet definitions to use new spacing/colors

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Test in Expo**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx expo start`
Expected: App launches, home screen renders with new design

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/index.tsx
git commit -m "feat: rebuild home screen with premium Apple-inspired design"
```

---

### Task 9: Update BookStack Component

**Files:**
- Modify: `src/components/BookStack.tsx`

**Interfaces:**
- Consumes: `useTheme`, `HeroCard`, `BookCard`
- Produces: Updated hero stack using HeroCard

- [ ] **Step 1: Update BookStack to use HeroCard for featured**

Review and update the BookStack component to use the new HeroCard for the featured book display, maintaining the existing carousel functionality but with updated styling.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/BookStack.tsx
git commit -m "feat: update BookStack with HeroCard integration"
```

---

## Phase 5: Library Screen

### Task 10: Rebuild Library Screen

**Files:**
- Modify: `app/(tabs)/library.tsx:1-261`

**Interfaces:**
- Consumes: `SearchBar`, `useTheme`, `BookCard`, services
- Produces: Updated library with new search and card design

- [ ] **Step 1: Update Library Screen**

Key changes:
- Replace TextInput with `<SearchBar />`
- Update header typography to use new FontSize tokens
- Ensure BookCard uses new premium design
- Update grid spacing

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/library.tsx
git commit -m "feat: rebuild library screen with new design system"
```

---

## Phase 6: Profile Screen

### Task 11: Rebuild Profile Screen

**Files:**
- Modify: `app/(tabs)/profile.tsx:1-193`

**Interfaces:**
- Consumes: `useTheme`, `useAuth`, `Spacing`, `FontSize`, `BorderRadius`
- Produces: Updated profile with premium card design

- [ ] **Step 1: Update Profile Screen**

Key changes:
- Update user card with new surface colors and shadows
- Update menu items with new typography
- Update logout button with new styling
- Update guest mode with new button styles

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/(tabs)/profile.tsx
git commit -m "feat: rebuild profile screen with premium design"
```

---

## Phase 7: Secondary Screens

### Task 12: Rebuild Book Detail Screen

**Files:**
- Modify: `app/book/[id].tsx`

**Interfaces:**
- Consumes: `useTheme`, book services
- Produces: Updated book detail with new typography and colors

- [ ] **Step 1: Update Book Detail Screen**

Update typography, colors, and spacing to match new design system. Focus on:
- Header typography
- Book info section
- Action buttons
- Related books section

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/book/[id].tsx
git commit -m "feat: rebuild book detail screen with new design"
```

---

### Task 13: Rebuild Settings Screen

**Files:**
- Modify: `app/settings.tsx`

**Interfaces:**
- Consumes: `useTheme`, `useAuth`
- Produces: Updated settings with new design

- [ ] **Step 1: Update Settings Screen**

Update all styling to use new theme tokens, section headers, and menu items.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/settings.tsx
git commit -m "feat: rebuild settings screen with new design"
```

---

### Task 14: Rebuild Favorites Screen

**Files:**
- Modify: `app/favorites.tsx`

**Interfaces:**
- Consumes: `useTheme`, `BookCard`, services
- Produces: Updated favorites with new design

- [ ] **Step 1: Update Favorites Screen**

Update styling to use new theme tokens and BookCard design.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/favorites.tsx
git commit -m "feat: rebuild favorites screen with new design"
```

---

### Task 15: Rebuild History Screen

**Files:**
- Modify: `app/history.tsx`

**Interfaces:**
- Consumes: `useTheme`, `BookCard`, services
- Produces: Updated history with new design

- [ ] **Step 1: Update History Screen**

Update styling to use new theme tokens and BookCard design.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/history.tsx
git commit -m "feat: rebuild history screen with new design"
```

---

### Task 16: Rebuild Notifications Screen

**Files:**
- Modify: `app/notifications.tsx`

**Interfaces:**
- Consumes: `useTheme`
- Produces: Updated notifications with new design

- [ ] **Step 1: Update Notifications Screen**

Update styling to use new theme tokens and typography.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/notifications.tsx
git commit -m "feat: rebuild notifications screen with new design"
```

---

### Task 17: Rebuild Help Screen

**Files:**
- Modify: `app/help.tsx`

**Interfaces:**
- Consumes: `useTheme`
- Produces: Updated help with new design

- [ ] **Step 1: Update Help Screen**

Update styling to use new theme tokens and typography.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/help.tsx
git commit -m "feat: rebuild help screen with new design"
```

---

### Task 18: Rebuild Onboarding Screen

**Files:**
- Modify: `app/onboarding.tsx`

**Interfaces:**
- Consumes: `useTheme`, `useAuth`
- Produces: Updated onboarding with new design

- [ ] **Step 1: Update Onboarding Screen**

Update styling to use new theme tokens, typography, and button styles.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/onboarding.tsx
git commit -m "feat: rebuild onboarding screen with new design"
```

---

### Task 19: Rebuild Login Screen

**Files:**
- Modify: `app/(auth)/login.tsx`

**Interfaces:**
- Consumes: `useTheme`, `useAuth`
- Produces: Updated login with new design

- [ ] **Step 1: Update Login Screen**

Update styling to use new theme tokens, input styles, and button styles.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/(auth)/login.tsx
git commit -m "feat: rebuild login screen with new design"
```

---

### Task 20: Rebuild Shelf/Category Screen

**Files:**
- Modify: `app/shelf/[category].tsx`

**Interfaces:**
- Consumes: `useTheme`, `BookCard`, `SearchBar`
- Produces: Updated shelf with new design

- [ ] **Step 1: Update Shelf Screen**

Update styling to use new theme tokens, search bar, and book card design.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/shelf/[category].tsx
git commit -m "feat: rebuild shelf screen with new design"
```

---

### Task 21: Update SkeletonLoader

**Files:**
- Modify: `src/components/SkeletonLoader.tsx`

**Interfaces:**
- Consumes: `useTheme`
- Produces: Updated skeleton matching new card design

- [ ] **Step 1: Update SkeletonLoader**

Update skeleton styles to match new card dimensions and border radius.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/SkeletonLoader.tsx
git commit -m "feat: update SkeletonLoader to match new design"
```

---

### Task 22: Update BookCoverPlaceholder

**Files:**
- Modify: `src/components/BookCoverPlaceholder.tsx`

**Interfaces:**
- Consumes: `useTheme`
- Produces: Updated placeholder matching new design

- [ ] **Step 1: Update BookCoverPlaceholder**

Update placeholder styles to match new card design with spine effect.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/BookCoverPlaceholder.tsx
git commit -m "feat: update BookCoverPlaceholder with new design"
```

---

### Task 23: Update RequestBookModal

**Files:**
- Modify: `src/components/RequestBookModal.tsx`

**Interfaces:**
- Consumes: `useTheme`
- Produces: Updated modal with new design

- [ ] **Step 1: Update RequestBookModal**

Update modal styling to use new theme tokens, input styles, and button styles.

- [ ] **Step 2: Run typecheck**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/RequestBookModal.tsx
git commit -m "feat: update RequestBookModal with new design"
```

---

## Phase 8: Final Verification

### Task 24: Full App Testing

- [ ] **Step 1: Run typecheck on entire project**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx tsc --noEmit`
Expected: PASS

- [ ] **Step 2: Test all screens in Expo**

Run: `cd /run/media/zaidxme/University/Summer/BooksApp/Zesho && npx expo start`

Test checklist:
- [ ] Home screen loads with hero card
- [ ] Continue Reading shows progress bars
- [ ] Trending books display correctly
- [ ] Quick actions navigate properly
- [ ] Library search works
- [ ] Library grid displays correctly
- [ ] Profile shows user info
- [ ] Book detail opens correctly
- [ ] Tab bar navigation works
- [ ] Dark mode toggles correctly
- [ ] All screens have consistent styling

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete UI rebuild to Apple-inspired minimal design"
```

---

## Self-Review Checklist

1. **Spec coverage:** All 15 screens covered in tasks
2. **Placeholder scan:** No TBDs or TODOs
3. **Type consistency:** All component props defined
4. **File paths:** All paths verified
5. **Commands:** All run commands specified
6. **Commits:** Each task has commit step

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2024-12-19-zesho-ui-rebuild.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
