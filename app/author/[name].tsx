import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { BookCard } from '../../src/components/BookCard';
import { SearchBar } from '../../src/components/SearchBar';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../src/constants/theme';
import { Book } from '../../src/types';
import { getBooksByAuthor } from '../../src/services/authorIndex';

const PAGE_SIZE = 30;

export default function AuthorDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);

  const authorName = name || '';

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    loadInitial();
  }, [authorName]);

  const loadInitial = async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    setBooks([]);
    setHasMore(true);

    try {
      if (searchMode && searchQuery) {
        const all = getBooksByAuthor(authorName);
        const filtered = all.filter(b =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (mountedRef.current) setBooks(filtered.slice(0, PAGE_SIZE));
      } else {
        const results = getBooksByAuthor(authorName).slice(0, PAGE_SIZE);
        if (mountedRef.current) setBooks(results);
        setHasMore(results.length >= PAGE_SIZE);
      }
    } catch {}

    if (mountedRef.current) setLoading(false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore || searchMode) return;
    setLoadingMore(true);

    try {
      const moreBooks = getBooksByAuthor(authorName).slice(books.length, books.length + PAGE_SIZE);
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
    const all = getBooksByAuthor(authorName);
    const filtered = all.filter(b =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (mountedRef.current) {
      setBooks(filtered.slice(0, PAGE_SIZE));
      setLoading(false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={s.footer}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={s.emptyWrap}>
        <MaterialIcons name="person" size={48} color={colors.textMuted} />
        <Text style={[s.emptyText, { color: colors.textSecondary }]}>No books found for this author</Text>
      </View>
    );
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <View style={s.bookItem}>
      <BookCard book={item} size={110} />
    </View>
  );

  const totalBooks = getBooksByAuthor(authorName).length;

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + Spacing.md, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={s.headerInfo}>
          <Text style={[s.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {authorName}
          </Text>
          {!loading && (
            <Text style={[s.count, { color: colors.textMuted }]}>
              {totalBooks} book{totalBooks !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        <TouchableOpacity style={s.backBtn} onPress={() => setSearchMode(!searchMode)}>
          <MaterialIcons name={searchMode ? 'close' : 'search'} size={18} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {searchMode && (
        <View style={s.searchBarWrap}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={`Search books by ${authorName}...`}
            onSubmitEditing={handleSearch}
          />
        </View>
      )}

      {loading ? (
        <View style={s.loadingWrap}>
          <View style={s.skeletonGrid}>
            {Array.from({ length: 9 }).map((_, i) => (
              <View key={i} style={s.skeletonItem}>
                <View style={[s.skeletonCard, { backgroundColor: colors.surfaceElevated }]} />
              </View>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={books}
          numColumns={3}
          keyExtractor={(item, i) => `${item.id}_${i}`}
          contentContainerStyle={s.grid}
          columnWrapperStyle={s.row}
          renderItem={renderBookItem}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
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
});
