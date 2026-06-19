import React, { useRef, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, Animated,
  PanResponder, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types';
import { Spacing, FontSize, BorderRadius, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { HeroCard } from './HeroCard';

const SWIPE_THRESHOLD = 120;
const CARD_WIDTH = Dimensions.get('window').width - Spacing.xxl * 2;
const CARD_HEIGHT = CARD_WIDTH * 0.72;
const VISIBLE_STACK = 3;

interface BookStackProps {
  books: Book[];
  title?: string;
}

export function BookStack({ books, title }: BookStackProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const stack = useMemo(() => books.slice(0, 10), [books]);

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const currentIdx = useRef(0);
  const [, forceUpdate] = React.useState(0);

  const nextCard = useCallback(() => {
    if (currentIdx.current < stack.length - 1) {
      currentIdx.current += 1;
      pan.setValue({ x: 0, y: 0 });
      scale.setValue(1);
      forceUpdate(n => n + 1);
    }
  }, [stack.length, pan, scale]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        pan.setValue({ x: g.dx, y: 0 });
        const s = Math.max(0.92, 1 - Math.abs(g.dx) / (CARD_WIDTH * 2));
        scale.setValue(s);
      },
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > SWIPE_THRESHOLD) {
          const dir = g.dx > 0 ? 1 : -1;
          Animated.timing(pan, {
            toValue: { x: dir * CARD_WIDTH * 1.5, y: 0 },
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            scale.setValue(1);
            nextCard();
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            useNativeDriver: true,
          }).start();
          Animated.spring(scale, {
            toValue: 1,
            friction: 7,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const cardPress = useCallback((book: Book) => {
    router.push(`/book/${book.id}`);
  }, [router]);

  if (stack.length === 0) return null;

  const visibleCards = stack.slice(currentIdx.current, currentIdx.current + VISIBLE_STACK);

  return (
    <View style={styles.wrapper}>
      {title && (
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          <View style={styles.dots}>
            {stack.slice(0, Math.min(6, stack.length)).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === 0 ? colors.textPrimary : colors.textMuted,
                    width: i === 0 ? 18 : 6,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      <View style={styles.stackContainer}>
        {visibleCards.map((book, i) => {
          const isTop = i === 0;
          const offsetY = i * 8;
          const offsetScale = 1 - i * 0.04;

          if (isTop) {
            return (
              <Animated.View
                key={book.id + currentIdx.current}
                style={[
                  styles.card,
                  {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    zIndex: visibleCards.length - i,
                    transform: [
                      { translateX: pan.x },
                      { translateY: pan.y },
                      { scale: Animated.multiply(scale, offsetScale) },
                    ],
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <HeroCard
                  label="NOW READING"
                  title={book.title}
                  description={book.description?.replace(/<[^>]*>/g, '')}
                  onPress={() => cardPress(book)}
                />
              </Animated.View>
            );
          }

          return (
            <View
              key={book.id}
              style={[
                styles.card,
                styles.cardBack,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.borderLight,
                  top: offsetY,
                  transform: [{ scale: offsetScale }],
                  zIndex: visibleCards.length - i,
                  opacity: 0.5 - i * 0.12,
                },
              ]}
            >
            </View>
          );
        })}
      </View>

      <View style={styles.hintRow}>
        <Ionicons name="chevron-back" size={14} color={colors.textMuted} />
        <Text style={[styles.hintText, { color: colors.textMuted }]}>Swipe to explore</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.heading4, fontWeight: '700', letterSpacing: -0.3,
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { height: 6, borderRadius: 3 },

  stackContainer: {
    height: CARD_HEIGHT + 30,
    marginBottom: Spacing.sm,
  },

  card: {
    position: 'absolute',
    left: 0, right: 0,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadows.elevated,
  },
  cardBack: {
    shadowOpacity: 0,
    elevation: 0,
  },
  hintRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.xs,
  },
  hintText: { fontSize: FontSize.xs },
});
