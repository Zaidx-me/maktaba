import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '../../src/context/ThemeContext';

function AuthLayoutInner() {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    />
  );
}

export default function AuthLayout() {
  return (
    <ThemeProvider>
      <AuthLayoutInner />
    </ThemeProvider>
  );
}
