import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Spacing, FontSize, BorderRadius } from '../src/constants/theme';
import { useTheme } from '../src/context/ThemeContext';

interface SettingItem {
  icon: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'arrow' | 'info';
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark, colors, toggleTheme } = useTheme();

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Appearance',
      items: [{
        icon: 'dark-mode', title: 'Dark Mode',
        subtitle: isDark ? 'Currently dark' : 'Currently light',
        type: 'toggle', value: isDark, onToggle: () => toggleTheme(),
      }],
    },
    {
      title: 'About',
      items: [
        { icon: 'description', title: 'Terms of Service', type: 'arrow' },
        { icon: 'verified-user', title: 'Privacy Policy', type: 'arrow' },
        { icon: 'info', title: 'App Version', subtitle: '1.0.0', type: 'info' },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map((section, sIdx) => (
          <View key={sIdx} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{section.title}</Text>
            <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
              {section.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={iIdx}
                  style={[styles.row, iIdx < section.items.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
                  onPress={item.onPress}
                  disabled={item.type === 'toggle' || item.type === 'info'}
                  activeOpacity={0.7}
                >
                  <View style={styles.rowLeft}>
                    <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
                      <MaterialIcons name={item.icon as any} size={20} color={colors.textPrimary} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                      {item.subtitle && (
                        <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  {item.type === 'toggle' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: colors.accent }}
                      thumbColor={item.value ? colors.onPrimary : colors.textSecondary}
                      ios_backgroundColor={colors.border}
                    />
                  )}
                  {item.type === 'arrow' && <MaterialIcons name="chevron-right" size={20} color={colors.textMuted} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.heading5,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  rowText: {
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: FontSize.bodyMd,
    fontWeight: '500',
  },
  rowSub: {
    fontSize: FontSize.bodySm,
    marginTop: 2,
  },
});
