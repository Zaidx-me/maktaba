import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../constants/theme';

interface QuickActionCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
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
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name={icon} size={24} color={accent} />
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
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: FontSize.bodySmMedium,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});
