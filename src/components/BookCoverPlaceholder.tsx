import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius } from '../constants/theme';

interface BookCoverPlaceholderProps {
  title: string;
  width: number;
  height: number;
}

const CINEMATIC_GRADIENTS_LIGHT: [string, string][] = [
  ['#E8D5B7', '#C4A882'],
  ['#B8C5D6', '#8FA3B8'],
  ['#D4C5E0', '#B5A0C8'],
  ['#C8D8C5', '#A3B8A0'],
  ['#D6C8B8', '#C0A890'],
  ['#C5D0D8', '#A0B0C0'],
  ['#D8D0C0', '#C0B098'],
  ['#C0D0C8', '#98B0A8'],
  ['#D0C0D0', '#B8A0B8'],
  ['#C8D8D0', '#A0B8B0'],
];

const CINEMATIC_GRADIENTS_DARK: [string, string][] = [
  ['#1a1520', '#2d1f35'],
  ['#0f1a2e', '#1a2d4a'],
  ['#1a1a1a', '#2d2d2d'],
  ['#0d1117', '#161b22'],
  ['#1c1c1e', '#2c2c2e'],
  ['#111827', '#1f2937'],
  ['#18181b', '#27272a'],
  ['#1a1a2e', '#16213e'],
  ['#0f0f23', '#1a1a3e'],
  ['#1e1e2e', '#2e2e3e'],
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function BookCoverPlaceholder({ title, width, height }: BookCoverPlaceholderProps) {
  const { colors, isDark } = useTheme();
  const gradients = isDark ? CINEMATIC_GRADIENTS_DARK : CINEMATIC_GRADIENTS_LIGHT;
  const idx = hashString(title) % gradients.length;
  const [startColor, endColor] = gradients[idx]!;

  return (
    <View style={[styles.container, { width, height, borderRadius: BorderRadius.lg }]}>
      <LinearGradient
        colors={[startColor, endColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />
      <View style={[styles.spine, { backgroundColor: colors.glassLight }]} />
    </View>
  );
}

export function BookSkeleton({ width, height }: { width: number; height: number }) {
  const { isDark } = useTheme();
  return (
    <LinearGradient
      colors={isDark ? ['#1a1a1a', '#2a2a2a', '#1a1a1a'] : ['#e8e8e8', '#f5f5f5', '#e8e8e8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.skeleton, { width, height }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  skeleton: {
    borderRadius: BorderRadius.lg,
  },
});
