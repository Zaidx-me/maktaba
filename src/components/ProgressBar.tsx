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