import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { BookCard } from '../../src/components/BookCard';
import { SearchBar } from '../../src/components/SearchBar';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../src/constants/theme';
import { Book } from '../../src/types';
import { getAllUrduBooks, searchUrduBooks, getUrduBooksByCategory, getUrduBooksByMainCategory } from '../../src/services/urduBooks';
import { getAllPdfBooks, searchPdfBooks, getPdfBooksByMainCategory } from '../../src/services/pdfBooksFree';

const PAGE_SIZE = 30;

function searchLocal(query: string, limit: number): Book[] {
  const urdu = searchUrduBooks(query, limit);
  const pdf = searchPdfBooks(query, limit);
  const seen = new Set<string>();
  const result: Book[] = [];
  for (const b of [...urdu, ...pdf]) {
    if (!seen.has(b.id)) { seen.add(b.id); result.push(b); }
  }
  return result.slice(0, limit);
}

function loadBooksByKey(category: string, query: string, limit: number): Book[] {
  // Try exact category match first (most reliable)
  const urduByCat = getUrduBooksByCategory(category, limit);
  if (urduByCat.length > 0) return urduByCat;

  // Try main category match (for shelf tab categories like "Islamic Books")
  const urduByMain = getUrduBooksByMainCategory(category, limit);
  if (urduByMain.length > 0) return urduByMain;

  // Try PDF categories
  const pdfByMain = getPdfBooksByMainCategory(category, limit);
  if (pdfByMain.length > 0) return pdfByMain;

  // Fall back to text search using query
  if (query) return searchLocal(query, limit);

  return [];
}

export default function ShelfCategoryScreen() {
  const { category, title, query } = useLocalSearchParams<{
    category: string;
    title: string;
    query?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    loadInitial();
  }, [category, query]);

  const loadInitial = async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setBooks([]);
    setHasMore(true);
    setError(null);

    try {
      if (searchMode && searchQuery) {
        const results = searchLocal(searchQuery, PAGE_SIZE);
        if (mountedRef.current) setBooks(results);
      } else {
        const results = loadBooksByKey(category || '', query || '', PAGE_SIZE);
        if (mountedRef.current) setBooks(results);
        setHasMore(results.length >= PAGE_SIZE);
      }
    } catch {
      if (mountedRef.current) setError('Failed to load books');
    }

    if (mountedRef.current) setLoading(false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore || searchMode) return;
    setLoadingMore(true);

    try {
      const moreBooks = loadBooksByKey(category || '', query || '', books.length + PAGE_SIZE).slice(books.length);
      if (!mountedRef.current) return;
      if (moreBooks.length === 0) {
        setHasMore(false);
      } else {
        setBooks(prev => [...prev, ...moreBooks]);
      }
    } catch {}

    if (mountedRef.current) setLoadingMore(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitial();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchMode(false);
      loadInitial();
      return;
    }
    setSearchMode(true);
    setLoading(true);
    const results = searchLocal(searchQuery, PAGE_SIZE);
    if (mountedRef.current) {
      setBooks(results);
      setLoading(false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.coolSlate} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    if (error) {
      return (
        <View style={styles.emptyWrap}>
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{error}</Text>
          <TouchableOpacity onPress={loadInitial} style={[styles.retryBtn, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.retryText, { color: colors.accentBright }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.emptyWrap}>
        <MaterialIcons name="menu-book" size={48} color={colors.textMuted} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No books found</Text>
      </View>
    );
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <View style={styles.bookItem}>
      <BookCard book={item} size={110} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>{title}</Text>
          {!loading && <Text style={[styles.count, { color: colors.textMuted }]}>{books.length} books</Text>}
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => setSearchMode(!searchMode)}>
          <MaterialIcons name={searchMode ? 'close' : 'search'} size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {searchMode && (
        <View style={styles.searchBarWrap}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search in this category..."
            onSubmitEditing={handleSearch}
          />
        </View>
      )}

      {loading ? (
        <View style={styles.loadingWrap}>
          <View style={styles.skeletonGrid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <View key={i} style={styles.skeletonItem}>
                <View style={[styles.skeletonCard, { backgroundColor: colors.surfaceElevated }]} />
              </View>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={books}
          numColumns={3}
          keyExtractor={(item, i) => `${item.id}_${i}`}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={renderBookItem}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.coolSlate}
            />
          }
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSize.heading5,
    fontWeight: FontWeight.semibold,
    letterSpacing: -0.5,
  },
  count: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  searchBarWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  grid: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  bookItem: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  loadingWrap: {
    flex: 1,
    padding: Spacing.xl,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  skeletonItem: {
    width: '30%',
    marginBottom: Spacing.lg,
  },
  skeletonCard: {
    width: '100%',
    aspectRatio: 0.69,
    borderRadius: BorderRadius.md,
  },
  footer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.bodyMd,
    fontWeight: FontWeight.regular,
  },
  retryBtn: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
  },
  retryText: {
    fontSize: FontSize.bodyMd,
    fontWeight: FontWeight.semibold,
  },
});
