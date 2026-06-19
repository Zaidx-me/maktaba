import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../src/constants/theme';
import { useTheme } from '../src/context/ThemeContext';

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();

  const faqItems = [
    {
      icon: 'book-outline' as const,
      q: 'What is Zesho?',
      a: 'Zesho is a free book reading app with thousands of books from Google Books, Gutendex, Open Library, and 2,138+ Urdu books from TheLibraryPK.',
    },
    {
      icon: 'library-outline' as const,
      q: 'How do I add books to my library?',
      a: 'Tap on any book and use the "Want to Read" or "Reading" buttons. Your library syncs locally on your device.',
    },
    {
      icon: 'cash-outline' as const,
      q: 'Are all books free?',
      a: 'Yes! Zesho provides access to public domain books and free samples. No payment is required.',
    },
    {
      icon: 'moon-outline' as const,
      q: 'How do I switch dark mode?',
      a: 'Go to Profile → Settings → Dark Mode toggle.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Help Center</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.aboutCard, { backgroundColor: colors.surfaceElevated }, Shadows.card]}>
          <View style={[styles.logoCircle, { backgroundColor: colors.accentSoft }]}>
            <Ionicons name="book" size={28} color={colors.accent} />
          </View>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>Zesho</Text>
          <Text style={[styles.appVersion, { color: colors.textTertiary }]}>Version 1.0.0</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>FAQ</Text>
        <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
          {faqItems.map((item, i) => (
            <View
              key={i}
              style={[
                styles.faqRow,
                i < faqItems.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
            >
              <View style={styles.faqContent}>
                <View style={[styles.faqIconWrap, { backgroundColor: colors.primarySoft }]}>
                  <Ionicons name={item.icon} size={18} color={colors.textPrimary} />
                </View>
                <View style={styles.faqTextWrap}>
                  <Text style={[styles.faqQ, { color: colors.textPrimary }]}>{item.q}</Text>
                  <Text style={[styles.faqA, { color: colors.textSecondary }]}>{item.a}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Contact</Text>
        <TouchableOpacity
          style={[styles.contactItem, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => Linking.openURL('mailto:zesho.support@gmail.com')}
          activeOpacity={0.7}
        >
          <View style={[styles.contactIconWrap, { backgroundColor: colors.accentSoft }]}>
            <Ionicons name="mail-outline" size={20} color={colors.accent} />
          </View>
          <Text style={[styles.contactText, { color: colors.textPrimary }]}>zesho.support@gmail.com</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
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
  headerTitle: {
    fontSize: FontSize.heading5,
    fontWeight: FontWeight.bold,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xxl,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSize.heading4,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xs,
  },
  appVersion: {
    fontSize: FontSize.bodySm,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xxl,
    overflow: 'hidden',
  },
  faqRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  faqContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  faqIconWrap: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqTextWrap: {
    flex: 1,
  },
  faqQ: {
    fontSize: FontSize.bodyMd,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  faqA: {
    fontSize: FontSize.bodySm,
    lineHeight: 18,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    flex: 1,
    fontSize: FontSize.bodyMd,
    fontWeight: FontWeight.medium,
  },
});
