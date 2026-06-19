import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Spacing, FontSize, FontWeight } from '../constants/theme';

interface SectionHeaderProps {
  label?: string;
  title: string;
  seeAllText?: string;
  onSeeAll?: () => void;
}

export function SectionHeader({ label, title, seeAllText = 'See All', onSeeAll }: SectionHeaderProps) {
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
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xxs,
  },
  title: {
    fontSize: FontSize.heading3,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: FontSize.bodyMd,
    fontWeight: FontWeight.medium,
  },
});
