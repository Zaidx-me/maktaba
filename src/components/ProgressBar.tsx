import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BorderRadius } from '../constants/theme';

interface ProgressBarProps {
  progress: number;
  height?: number;
}

export const ProgressBar = React.memo(function ProgressBar({ progress, height = 2 }: ProgressBarProps) {
  const { colors } = useTheme();
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.container, { height, backgroundColor: colors.separator, borderRadius: height / 2 }]}>
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
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
