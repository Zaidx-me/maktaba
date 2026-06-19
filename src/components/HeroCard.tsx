import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../constants/theme';

interface HeroCardProps {
  label?: string;
  title: string;
  description?: string;
  bookCount?: number;
  onPress?: () => void;
}

export function HeroCard({ label, title, description, bookCount, onPress }: HeroCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.accent }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.content}>
        {label && <Text style={styles.label}>{label}</Text>}
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        <View style={styles.footer}>
          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>Explore</Text>
          </View>
          {bookCount !== undefined && (
            <Text style={styles.bookCount}>{bookCount} books</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    minHeight: 160,
  },
  content: {
    padding: Spacing.xxl,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.heading2,
    fontWeight: FontWeight.bold,
    color: '#fff',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.bodyMd,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  ctaButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  ctaText: {
    color: '#fff',
    fontSize: FontSize.bodyMd,
    fontWeight: FontWeight.semibold,
  },
  bookCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.sm,
  },
});
