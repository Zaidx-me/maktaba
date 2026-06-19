import React, { useEffect, useState, useRef, useCallback, useMemo, useReducer } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, Image, Animated, InteractionManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BookRow } from '../../src/components/BookRow';
import { SkeletonRow } from '../../src/components/SkeletonLoader';
import { RequestBookModal } from '../../src/components/RequestBookModal';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Book } from '../../src/types';
import { useTheme } from '../../src/context/ThemeContext';
import { getCachedBooks, preloadBooks } from '../../src/services/bookCache';
import { getAllUrduBooks, getUrduBooksByCategory } from '../../src/services/urduBooks';
import { getAllPdfBooks } from '../../src/services/pdfBooksFree';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants/theme';
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
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
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

  const featuredBook = state.heroBooks[0];

  return (
    <View style={[s.container, { backgroundColor: colors.groupedBackground }]}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[s.scrollContent, { paddingTop: insets.top }]}
        refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[s.header, { paddingHorizontal: Spacing.xxl }]}>
          <Text style={[s.headerTitle, { color: colors.textPrimary }]}>Home</Text>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={[s.iconBtn, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="notifications-none" size={20} color={colors.textPrimary} />
            {state.hasUnread && <View style={[s.notifDot, { backgroundColor: colors.error }]} />}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={[s.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => router.push('/(tabs)/search')}
          activeOpacity={0.7}
        >
          <MaterialIcons name="search" size={18} color={colors.textMuted} />
          <Text style={[s.searchPlaceholder, { color: colors.textMuted }]}>Search</Text>
        </TouchableOpacity>

        {state.loading ? (
          <View style={{ paddingHorizontal: Spacing.xxl }}>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Continue Reading */}
            {featuredBook && (
              <View style={s.section}>
                <View style={[s.sectionHeader, { paddingHorizontal: Spacing.xxl }]}>
                  <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>Continue Reading</Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/library')}>
                    <Text style={[s.seeAll, { color: colors.accent }]}>See All</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[s.featuredCard, { backgroundColor: colors.surface, marginHorizontal: Spacing.xxl }, Shadows.card]}
                  onPress={() => router.push(`/book/${featuredBook.id}`)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: featuredBook.thumbnail }} style={s.featuredImage} />
                  <View style={s.featuredInfo}>
                    <Text style={[s.featuredTitle, { color: colors.textPrimary }]} numberOfLines={2}>
                      {featuredBook.title}
                    </Text>
                    {featuredBook.authors?.[0] && (
                      <Text style={[s.featuredAuthor, { color: colors.textSecondary }]} numberOfLines={1}>
                        {featuredBook.authors[0]}
                      </Text>
                    )}
                    <View style={s.featuredProgress}>
                      <ProgressBar progress={0.35} height={2} />
                      <Text style={[s.progressText, { color: colors.textMuted }]}>35%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Top Picks */}
            {state.famousBooks.length > 0 && (
              <BookRow
                title="Top Picks"
                label="FOR YOU"
                books={state.famousBooks}
                bookSize={120}
                onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'famous', title: 'Top Picks', query: 'famous classic books' } })}
              />
            )}

            {/* Trending Now */}
            {state.trendingBooks.length > 0 && (
              <BookRow
                title="Trending Now"
                books={state.trendingBooks}
                bookSize={120}
                onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'trending_now', title: 'Trending Now', query: 'trending now 2025' } })}
              />
            )}

            {/* Categories */}
            <View style={s.section}>
              <View style={[s.sectionHeader, { paddingHorizontal: Spacing.xxl }]}>
                <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>Browse</Text>
              </View>
              <View style={[s.categoriesGrid, { paddingHorizontal: Spacing.xxl }]}>
                {[
                  { icon: 'book', label: 'Islamic', color: '#6C63FF' },
                  { icon: 'auto-stories', label: 'Novels', color: '#E07C24' },
                  { icon: 'history-edu', label: 'History', color: '#34C759' },
                  { icon: 'menu-book', label: 'Poetry', color: '#FF6B6B' },
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat.label}
                    style={[s.categoryChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    activeOpacity={0.7}
                    onPress={() => {
                      const queryMap: Record<string, string> = {
                        Islamic: 'Islamic books',
                        Novels: 'Urdu novels',
                        History: 'history biography',
                        Poetry: 'poetry literature',
                      };
                      const catMap: Record<string, string> = {
                        Islamic: 'islamic',
                        Novels: 'urdu_novels',
                        History: 'history',
                        Poetry: 'poetry',
                      };
                      router.push({ pathname: '/shelf/[category]', params: { category: catMap[cat.label], title: cat.label, query: queryMap[cat.label] } });
                    }}
                  >
                    <MaterialIcons name={cat.icon as any} size={20} color={cat.color} />
                    <Text style={[s.categoryLabel, { color: colors.textPrimary }]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Islamic Books */}
            {state.islamicBooks.length > 0 && (
              <BookRow
                title="Islamic Books"
                books={state.islamicBooks}
                bookSize={110}
                onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'islamic', title: 'Islamic Books', query: 'Islamic books' } })}
              />
            )}

            {/* Urdu Novels */}
            {state.novelBooks.length > 0 && (
              <BookRow
                title="Urdu Novels"
                books={state.novelBooks}
                bookSize={110}
                onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'urdu_novels', title: 'Urdu Novels', query: 'Urdu novels' } })}
              />
            )}

            {/* History */}
            {state.historyBooks.length > 0 && (
              <BookRow
                title="History & Biography"
                books={state.historyBooks}
                bookSize={110}
                onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'history', title: 'History & Biography', query: 'history biography' } })}
              />
            )}

            {/* Poetry */}
            {state.poetryBooks.length > 0 && (
              <BookRow
                title="Poetry & Literature"
                books={state.poetryBooks}
                bookSize={110}
                onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'poetry', title: 'Poetry & Literature', query: 'poetry literature' } })}
              />
            )}

            {/* Fun Reads */}
            {state.funnyBooks.length > 0 && (
              <BookRow
                title="Fun Reads"
                books={state.funnyBooks}
                bookSize={110}
                onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'funny', title: 'Fun Reads', query: 'funny humor' } })}
              />
            )}

            {/* PDF Novels */}
            {state.pdfNovels.length > 0 && (
              <BookRow
                title="PDF Novels"
                books={state.pdfNovels}
                bookSize={110}
                onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'pdf_novels', title: 'PDF Novels', query: 'Urdu novels PDF' } })}
              />
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
  scrollContent: { paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    height: 40,
    borderRadius: BorderRadius.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchPlaceholder: {
    fontSize: FontSize.bodyMd,
  },
  section: {
    marginBottom: Spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.heading3,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: FontSize.bodyMd,
    fontWeight: FontWeight.medium,
  },
  featuredCard: {
    flexDirection: 'row',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  featuredImage: {
    width: 80,
    height: 120,
    borderRadius: BorderRadius.md,
    backgroundColor: '#e0e0e0',
  },
  featuredInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  featuredTitle: {
    fontSize: FontSize.bodyMdMedium,
    fontWeight: FontWeight.semibold,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  featuredAuthor: {
    fontSize: FontSize.sm,
  },
  featuredProgress: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  progressText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    minWidth: '45%',
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  categoryLabel: {
    fontSize: FontSize.bodyMdMedium,
    fontWeight: FontWeight.medium,
  },
});
