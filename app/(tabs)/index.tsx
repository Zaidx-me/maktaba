import React, { useEffect, useState, useRef, useCallback, useMemo, useReducer } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, Image, Animated, InteractionManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookRow } from '../../src/components/BookRow';
import { SkeletonRow } from '../../src/components/SkeletonLoader';
import { RequestBookModal } from '../../src/components/RequestBookModal';
import { HeroCard } from '../../src/components/HeroCard';
import { QuickActionCard } from '../../src/components/QuickActionCard';
import { SearchBar } from '../../src/components/SearchBar';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Book } from '../../src/types';
import { useTheme } from '../../src/context/ThemeContext';
import { getCachedBooks, preloadBooks } from '../../src/services/bookCache';
import { getAllUrduBooks, getUrduBooksByCategory } from '../../src/services/urduBooks';
import { getAllPdfBooks } from '../../src/services/pdfBooksFree';
import { Spacing, FontSize, BorderRadius, Shadows } from '../../src/constants/theme';
import { getDismissedNotifications } from '../../src/services/localDb';
import { searchBooks } from '../../src/services/googleBooks';

interface HomeState {
  heroBooks: Book[];
  famousBooks: Book[];
  trendingBooks: Book[];
  islamicBooks: Book[];
  novelBooks: Book[];
  historyBooks: Book[];
  poetryBooks: Book[];
  funnyBooks: Book[];
  pdfNovels: Book[];
  loading: boolean;
  refreshing: boolean;
  hasUnread: boolean;
}

type HomeAction =
  | { type: 'SET_INITIAL'; hero: Book[]; famous: Book[]; trending: Book[] }
  | { type: 'SET_CATEGORY'; key: keyof HomeState; value: Book[] }
  | { type: 'SET_CATEGORIES'; books: Record<string, Book[]> }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_REFRESHING'; refreshing: boolean }
  | { type: 'SET_UNREAD'; hasUnread: boolean };

function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'SET_INITIAL':
      return { ...state, heroBooks: action.hero, famousBooks: action.famous, trendingBooks: action.trending };
    case 'SET_CATEGORY':
      return { ...state, [action.key]: action.value };
    case 'SET_CATEGORIES':
      return { ...state, ...action.books };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.refreshing };
    case 'SET_UNREAD':
      return { ...state, hasUnread: action.hasUnread };
    default:
      return state;
  }
}

const initialState: HomeState = {
  heroBooks: [],
  famousBooks: [],
  trendingBooks: [],
  islamicBooks: [],
  novelBooks: [],
  historyBooks: [],
  poetryBooks: [],
  funnyBooks: [],
  pdfNovels: [],
  loading: true,
  refreshing: false,
  hasUnread: false,
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [query, setQuery] = useState('');
  const [showRequest, setShowRequest] = useState(false);
  const [state, dispatch] = useReducer(homeReducer, initialState);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const nav = useNavigation();
  const lastTapRef = useRef(0);

  useEffect(() => {
    const unsub = (nav as any).addListener('tabPress', () => {
      const now = Date.now();
      if (now - lastTapRef.current < 400) {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    });
    return unsub;
  }, [nav]);

  const loadData = useCallback(async () => {
    try {
      const [heroRes, famousRes, trendingRes] = await Promise.allSettled([
        getCachedBooks('hero_disc', 'popular fiction bestseller', 10),
        getCachedBooks('famous', 'famous classic books', 20),
        getCachedBooks('trending_now', 'trending now 2025', 20),
      ]);
      const hero = heroRes.status === 'fulfilled'
        ? heroRes.value.filter((b: Book) => b.thumbnail)
        : await searchBooks('bestseller', 10).catch(() => [] as Book[]).then(r => r.filter((b: Book) => b.thumbnail));
      const famous = famousRes.status === 'fulfilled' ? famousRes.value.filter((b: Book) => b.thumbnail) : [];
      const trending = trendingRes.status === 'fulfilled' ? trendingRes.value.filter((b: Book) => b.thumbnail) : [];

      dispatch({ type: 'SET_INITIAL', hero, famous, trending });
    } catch {}
    dispatch({ type: 'SET_LOADING', loading: false });
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    InteractionManager.runAfterInteractions(() => {
      const seen = new Set<string>();
      const addUnique = (arr: Book[]) => {
        const result: Book[] = [];
        for (const b of arr) {
          if (!seen.has(b.id) && b.thumbnail) {
            seen.add(b.id);
            result.push(b);
          }
        }
        return result;
      };

      const allPdf = getAllPdfBooks();

      dispatch({
        type: 'SET_CATEGORIES',
        books: {
          islamicBooks: addUnique(getUrduBooksByCategory('Islamic Books', 15)).concat(
            addUnique(allPdf.filter(b => b.categories?.includes('Islamic Books')).slice(0, 10))
          ),
          novelBooks: addUnique(getUrduBooksByCategory('Urdu Novels', 20)),
          historyBooks: addUnique(getUrduBooksByCategory('History Books', 15)).concat(
            addUnique(allPdf.filter(b => b.categories?.includes('History')).slice(0, 8))
          ),
          poetryBooks: addUnique(getUrduBooksByCategory('Poetry Books', 12)).concat(
            addUnique(getUrduBooksByCategory('Column', 6))
          ),
          funnyBooks: addUnique(getUrduBooksByCategory('Funny Books', 12)),
          pdfNovels: addUnique(allPdf.filter(b => b.categories?.includes('Urdu Novels')).slice(0, 15)),
        },
      });
    });
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      preloadBooks();
      loadData();
      getDismissedNotifications().then(d => dispatch({ type: 'SET_UNREAD', hasUnread: d.length < 3 }));
    });
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    dispatch({ type: 'SET_REFRESHING', refreshing: true });
    await loadData();
    dispatch({ type: 'SET_REFRESHING', refreshing: false });
  }, [loadData]);

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push({ pathname: '/(tabs)/search', params: { q: query } });
  };

  const isEmpty = !state.heroBooks.length && !state.famousBooks.length && !state.trendingBooks.length;

  const continueReadingBooks = useMemo(() => {
    return state.famousBooks.slice(0, 3).map((book, i) => ({
      ...book,
      progress: [0.35, 0.62, 0.18][i] || 0.1,
    }));
  }, [state.famousBooks]);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[s.scrollContent, { paddingTop: insets.top + Spacing.md }]}
        refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} tintColor={colors.textSecondary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.header, { paddingHorizontal: Spacing.xxl }]}>
          <View>
            <Text style={[s.headerTitle, { color: colors.textPrimary }]}>Discover</Text>
            <Text style={[s.headerSub, { color: colors.textMuted }]}>Find your next great read</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={s.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            {state.hasUnread && <View style={[s.notifDot, { backgroundColor: colors.error }]} />}
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: Spacing.xxl, marginBottom: Spacing.lg }}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
        </View>

        {state.loading ? (
          <>
            <View style={{ height: 200, marginHorizontal: Spacing.xxl, marginBottom: Spacing.xl, borderRadius: BorderRadius.xxl, backgroundColor: colors.surfaceElevated }} />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            {state.heroBooks.length > 0 && (
              <View style={{ marginBottom: Spacing.xl }}>
                <HeroCard
                  label="FEATURED COLLECTION"
                  title="Explore 3000+ Books"
                  description="Urdu novels, Islamic books, PDFs and more"
                  bookCount={state.heroBooks.length}
                  onPress={() => router.push('/(tabs)/library')}
                />
              </View>
            )}

            {continueReadingBooks.length > 0 && (
              <View style={[s.section, { paddingHorizontal: Spacing.xxl }]}>
                <Text style={[s.sectionLabel, { color: colors.textSecondary }]}>CONTINUE READING</Text>
                <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>Pick up where you left off</Text>
                <View style={s.continueReadingList}>
                  {continueReadingBooks.map((book) => (
                    <TouchableOpacity
                      key={book.id}
                      style={[s.continueCard, { backgroundColor: colors.white }]}
                      onPress={() => router.push(`/book/${book.id}`)}
                      activeOpacity={0.7}
                    >
                      <Image source={{ uri: book.thumbnail }} style={s.continueCover} />
                      <View style={s.continueInfo}>
                        <Text style={[s.continueTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                          {book.title}
                        </Text>
                        {book.authors?.length > 0 && (
                          <Text style={[s.continueAuthor, { color: colors.textSecondary }]} numberOfLines={1}>
                            {book.authors[0]}
                          </Text>
                        )}
                        <ProgressBar progress={book.progress} height={3} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {isEmpty && (
              <View style={s.emptyState}>
                <Ionicons name="book-outline" size={48} color={colors.textMuted} />
                <Text style={[s.emptyTitle, { color: colors.textMuted }]}>Loading books...</Text>
                <Text style={[s.emptySub, { color: colors.textMuted }]}>Pull down to refresh</Text>
              </View>
            )}

            {state.famousBooks.length > 0 && (
              <BookRow title="Most Famous Books" label="POPULAR" books={state.famousBooks} bookSize={140} onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'famous', title: 'Most Famous Books', query: 'famous classic books' } })} />
            )}

            <View style={[s.quickActions, { paddingHorizontal: Spacing.xxl }]}>
              <QuickActionCard
                icon="library-outline"
                title="Library"
                subtitle="Your books"
                onPress={() => router.push('/(tabs)/library')}
              />
              <QuickActionCard
                icon="add-circle-outline"
                title="Request"
                subtitle="New book"
                onPress={() => setShowRequest(true)}
              />
              <QuickActionCard
                icon="heart-outline"
                title="Favorites"
                subtitle="Saved"
                onPress={() => router.push('/favorites')}
              />
            </View>

            {state.islamicBooks.length > 0 && (
              <BookRow title="Islamic Books" label="RELIGION" books={state.islamicBooks} bookSize={120} onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'islamic', title: 'Islamic Books', query: 'Islamic books' } })} />
            )}

            {state.novelBooks.length > 0 && (
              <BookRow title="Urdu Novels" label="FICTION" books={state.novelBooks} bookSize={150} onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'urdu_novels', title: 'Urdu Novels', query: 'Urdu novels' } })} />
            )}

            {state.trendingBooks.length > 0 && (
              <BookRow title="Trending Now" label="TRENDING" books={state.trendingBooks} bookSize={130} onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'trending_now', title: 'Trending Now', query: 'trending now 2025' } })} />
            )}

            {state.historyBooks.length > 0 && (
              <BookRow title="History & Biography" label="NON-FICTION" books={state.historyBooks} bookSize={125} onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'history', title: 'History & Biography', query: 'history biography' } })} />
            )}

            {state.poetryBooks.length > 0 && (
              <BookRow title="Poetry & Literature" label="POETRY" books={state.poetryBooks} bookSize={115} onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'poetry', title: 'Poetry & Literature', query: 'poetry literature' } })} />
            )}

            {state.funnyBooks.length > 0 && (
              <BookRow title="Fun Reads" label="HUMOR" books={state.funnyBooks} bookSize={120} onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'funny', title: 'Fun Reads', query: 'funny humor' } })} />
            )}

            {state.pdfNovels.length > 0 && (
              <BookRow title="PDF Novels" label="PDF" books={state.pdfNovels} bookSize={135} onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'pdf_novels', title: 'PDF Novels', query: 'Urdu novels PDF' } })} />
            )}
          </Animated.View>
        )}
      </ScrollView>

      <RequestBookModal visible={showRequest} onClose={() => setShowRequest(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  headerTitle: { fontSize: FontSize.heading2, fontWeight: '800', letterSpacing: -1 },
  headerSub: { fontSize: FontSize.xs, marginTop: 2 },
  notifBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: 4 },
  section: { marginBottom: Spacing.xl },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: Spacing.xs },
  sectionTitle: { fontSize: FontSize.heading3, fontWeight: '700', letterSpacing: -0.3, marginBottom: Spacing.lg },
  continueReadingList: { gap: Spacing.md },
  continueCard: { flexDirection: 'row', borderRadius: BorderRadius.lg, padding: Spacing.md, gap: Spacing.md, ...Shadows.card },
  continueCover: { width: 56, height: 80, borderRadius: BorderRadius.sm },
  continueInfo: { flex: 1, justifyContent: 'center', gap: Spacing.xs },
  continueTitle: { fontSize: FontSize.bodyMd, fontWeight: '600', letterSpacing: -0.1 },
  continueAuthor: { fontSize: FontSize.sm },
  quickActions: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
  emptyState: { alignItems: 'center', paddingTop: 40, paddingBottom: 40 },
  emptyTitle: { fontSize: FontSize.bodyMd, fontWeight: '600', marginTop: Spacing.md },
  emptySub: { fontSize: FontSize.xs, marginTop: 4 },
});
