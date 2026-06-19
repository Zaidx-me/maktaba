import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius, Spacing, Shadows } from '../constants/theme';

const { width } = Dimensions.get('window');

function Shimmer({ style }: { style: any }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <Animated.View style={[style, { opacity }]}>
      <LinearGradient
        colors={[colors.surface, colors.surfaceElevated, colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

interface SkeletonLoaderProps {
  count?: number;
  columns?: number;
}

export function SkeletonLoader({ count = 6, columns = 2 }: SkeletonLoaderProps) {
  const { colors } = useTheme();
  const cardWidth = (width - Spacing.xl * 2 - Spacing.sm * (columns - 1)) / columns;
  const cardHeight = cardWidth * 1.4;

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.card, { width: cardWidth }]}>
          <Shimmer style={[styles.imageContainer, { width: cardWidth, height: cardHeight, borderRadius: BorderRadius.lg, backgroundColor: colors.surface, ...Shadows.card }]} />
          <Shimmer style={[styles.textBlock, { backgroundColor: colors.surface }]} />
          <Shimmer style={[styles.textBlockSmall, { backgroundColor: colors.surface }]} />
        </View>
      ))}
    </View>
  );
}

export function SkeletonRow({ count = 4 }: { count?: number }) {
  const { colors } = useTheme();
  const cardWidth = 130;
  const cardHeight = cardWidth * 1.4;

  return (
    <View style={styles.rowContainer}>
      <Shimmer style={[styles.rowTitle, { backgroundColor: colors.surface }]} />
      <View style={styles.row}>
        {Array.from({ length: count }).map((_, index) => (
          <View key={index} style={[styles.rowCard, { width: cardWidth }]}>
            <Shimmer style={[styles.imageContainer, { width: cardWidth, height: cardHeight, borderRadius: BorderRadius.lg, backgroundColor: colors.surface, ...Shadows.card }]} />
            <Shimmer style={[styles.textBlock, { backgroundColor: colors.surface }]} />
            <Shimmer style={[styles.textBlockSmall, { backgroundColor: colors.surface }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  rowContainer: {
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  rowTitle: {
    height: 16,
    width: '40%',
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.md,
  },
  rowCard: {
    marginRight: Spacing.sm,
  },
  imageContainer: {
    width: '100%',
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  textBlock: {
    height: 12,
    borderRadius: BorderRadius.xs,
    marginBottom: 6,
    overflow: 'hidden',
  },
  textBlockSmall: {
    height: 10,
    borderRadius: BorderRadius.xs,
    width: '60%',
    overflow: 'hidden',
  },
});
