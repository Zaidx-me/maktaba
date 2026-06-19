import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookCard } from '../src/components/BookCard';
import { Book } from '../src/types';
import { useTheme } from '../src/context/ThemeContext';
import { useAuth } from '../src/context/AuthContext';
import { getUserBooks } from '../src/services/localDb';
import { Spacing, FontSize, BorderRadius } from '../src/constants/theme';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [history, setHistory] = useState<Book[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    if (!user) return;
    try {
      const library = await getUserBooks(user.uid);
      setHistory(library.filter(b => b.status === 'reading' || b.status === 'finished').map(b => ({
        id: b.bookId,
        title: b.title,
        thumbnail: b.thumbnail,
        authors: b.authors,
        description: '',
        publishedDate: '',
        pageCount: 0,
        categories: [],
        averageRating: 0,
        ratingsCount: 0,
        previewLink: '',
        infoLink: '',
        source: 'google' as const,
      })));
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Reading History</Text>
        <View style={styles.backBtn} />
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.accentSoft }]}>
            <Ionicons name="time-outline" size={40} color={colors.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No reading history</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Books you read will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <BookCard book={item} />
            </View>
          )}
        />
      )}
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
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  grid: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  bookItem: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.heading4,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.bodyMd,
    textAlign: 'center',
    lineHeight: 22,
  },
});
