import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, FontSize, FontWeight } from '../constants/theme';

interface SectionHeaderProps {
  title: string;
  label?: string;
  onSeeAll?: () => void;
}

export const SectionHeader = React.memo(function SectionHeader({ title, label, onSeeAll }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View>
        {label && <Text style={[styles.label, { color: colors.accent }]}>{label}</Text>}
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAll}>
          <Text style={[styles.seeAllText, { color: colors.textSecondary }]}>See All</Text>
          <MaterialIcons name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  title: {
    fontSize: FontSize.heading4,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: FontSize.bodySm,
    fontWeight: FontWeight.medium,
  },
});
