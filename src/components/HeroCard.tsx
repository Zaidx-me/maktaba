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
    fontSize: FontSize.bodySm,
  },
});
