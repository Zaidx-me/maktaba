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
import { MaterialIcons } from '@expo/vector-icons';
import { BookCard } from '../src/components/BookCard';
import { Book } from '../src/types';
import { useTheme } from '../src/context/ThemeContext';
import { useAuth } from '../src/context/AuthContext';
import { getUserBooks } from '../src/services/localDb';
import { Spacing, FontSize, BorderRadius } from '../src/constants/theme';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Book[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const library = await getUserBooks(user.uid);
      setFavorites(library.filter(b => b.status === 'want_to_read').map(b => ({
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
      console.error('Error loading favorites:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Favorites</Text>
        <View style={styles.backBtn} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.accentSoft }]}>
            <MaterialIcons name="favorite-border" size={40} color={colors.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No favorites yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Tap the heart icon on any book to save it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
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
