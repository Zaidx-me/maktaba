import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../src/context/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'library-books' as const,
    title: 'Discover Thousands of Books',
    desc: 'Explore a vast collection from Google Books, Open Library, Gutendex, and 2,138+ Urdu titles.',
  },
  {
    id: '2',
    icon: 'menu-book' as const,
    title: 'Read Anywhere',
    desc: 'In-app reader with page-flipping UI. Download or read online \u2014 your choice.',
  },
  {
    id: '3',
    icon: 'bookmark' as const,
    title: 'Build Your Library',
    desc: 'Track reading progress, write notes, and rate books. Your personal reading journey.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => router.replace('/(auth)/login');

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={[styles.slide, { width: SCREEN_W }]}>
      <View style={[styles.iconWrap, { backgroundColor: colors.accentSoft }]}>
        <MaterialIcons name={item.icon} size={56} color={colors.accentBright} />
      </View>
      <Text style={[styles.slideTitle, { color: colors.textPrimary }]}>{item.title}</Text>
      <Text style={[styles.slideDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
        <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.slidesWrap}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * SCREEN_W, i * SCREEN_W, (i + 1) * SCREEN_W];
            const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
            const dotOpacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
            const isActive = i === currentIndex;
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: isActive ? colors.accentBright : colors.border,
                  },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: colors.buttonPrimary }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={[styles.nextText, { color: colors.buttonPrimaryText }]}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <MaterialIcons name="arrow-forward" size={18} color={colors.buttonPrimaryText} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  skipText: {
    fontSize: FontSize.bodyMd,
    fontWeight: FontWeight.medium,
  },
  slidesWrap: { flex: 1, justifyContent: 'center' },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.xxxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  slideTitle: {
    fontSize: FontSize.heading2,
    fontWeight: FontWeight.extrabold,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    letterSpacing: -0.5,
  },
  slideDesc: {
    fontSize: FontSize.bodyMd,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },
  bottomSection: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: BorderRadius.full,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md + 4,
    borderRadius: BorderRadius.lg,
    ...Shadows.elevated,
  },
  nextText: {
    fontSize: FontSize.bodyMd,
    fontWeight: FontWeight.bold,
  },
});
