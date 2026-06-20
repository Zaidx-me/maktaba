import React, { useEffect, useState, useRef, useCallback, useReducer } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BookRow } from '../../src/components/BookRow';
import { RequestBookModal } from '../../src/components/RequestBookModal';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Book } from '../../src/types';
import { useTheme } from '../../src/context/ThemeContext';
import { getAllUrduBooks, getUrduBooksByCategory } from '../../src/services/urduBooks';
import { getAllPdfBooks } from '../../src/services/pdfBooksFree';
import { getPopularAuthors, AuthorInfo } from '../../src/services/authorIndex';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../../src/constants/theme';
import { getDismissedNotifications } from '../../src/services/localDb';

interface HomeState {
  heroBooks: Book[];
  islamicBooks: Book[];
  novelBooks: Book[];
  historyBooks: Book[];
  poetryBooks: Book[];
  funnyBooks: Book[];
  pdfNovels: Book[];
  popularWriters: AuthorInfo[];
  ready: boolean;
  refreshing: boolean;
  hasUnread: boolean;
}

type HomeAction =
  | { type: 'SET_BOOKS'; hero: Book[]; islamic: Book[]; novels: Book[]; history: Book[]; poetry: Book[]; funny: Book[]; pdf: Book[]; writers: AuthorInfo[] }
  | { type: 'SET_REFRESHING'; refreshing: boolean }
  | { type: 'SET_UNREAD'; hasUnread: boolean };

function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case 'SET_BOOKS':
      return {
        ...state,
        heroBooks: action.hero,
        islamicBooks: action.islamic,
        novelBooks: action.novels,
        historyBooks: action.history,
        poetryBooks: action.poetry,
        funnyBooks: action.funny,
        pdfNovels: action.pdf,
        popularWriters: action.writers,
        ready: true,
      };
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
  islamicBooks: [],
  novelBooks: [],
  historyBooks: [],
  poetryBooks: [],
  funnyBooks: [],
  pdfNovels: [],
  popularWriters: [],
  ready: false,
  refreshing: false,
  hasUnread: false,
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
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

  const loadBooks = useCallback(() => {
    const allPdf = getAllPdfBooks();
    const allUrdu = getAllUrduBooks(2138);

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

    const heroCandidates = allUrdu.filter(b => b.thumbnail).slice(0, 10);

    dispatch({
      type: 'SET_BOOKS',
      hero: heroCandidates,
      islamic: addUnique(getUrduBooksByCategory('Islamic Books', 15)).concat(
        addUnique(allPdf.filter(b => b.categories?.includes('Islamic Books')).slice(0, 10))
      ),
      novels: addUnique(getUrduBooksByCategory('Urdu Novels', 20)),
      history: addUnique(getUrduBooksByCategory('History Books', 15)).concat(
        addUnique(allPdf.filter(b => b.categories?.includes('History')).slice(0, 8))
      ),
      poetry: addUnique(getUrduBooksByCategory('Poetry Books', 12)).concat(
        addUnique(getUrduBooksByCategory('Column', 6))
      ),
      funny: addUnique(getUrduBooksByCategory('Funny Books', 12)),
      pdf: addUnique(allPdf.filter(b => b.categories?.includes('Urdu Novels')).slice(0, 15)),
      writers: getPopularAuthors(15),
    });

    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [fadeAnim]);

  useEffect(() => {
    loadBooks();
    getDismissedNotifications().then(d => dispatch({ type: 'SET_UNREAD', hasUnread: d.length < 3 }));
  }, [loadBooks]);

  const onRefresh = useCallback(async () => {
    dispatch({ type: 'SET_REFRESHING', refreshing: true });
    loadBooks();
    dispatch({ type: 'SET_REFRESHING', refreshing: false });
  }, [loadBooks]);

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
                <Image source={{ uri: featuredBook.thumbnail }} style={s.featuredImage} contentFit="cover" transition={200} cachePolicy="memory-disk" />
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

          {/* Categories */}
          <View style={s.section}>
            <View style={[s.sectionHeader, { paddingHorizontal: Spacing.xxl }]}>
              <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>Browse</Text>
            </View>
            <View style={[s.categoriesGrid, { paddingHorizontal: Spacing.xxl }]}>
              {[
                { icon: 'book', label: 'Islamic', color: '#CE9A7E' },
                { icon: 'auto-stories', label: 'Novels', color: '#DEB288' },
                { icon: 'history-edu', label: 'History', color: '#B8845E' },
                { icon: 'menu-book', label: 'Poetry', color: '#EDC587' },
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
                      Islamic: 'Islamic Books',
                      Novels: 'Urdu Novels',
                      History: 'History Books',
                      Poetry: 'Poetry Books',
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
              onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'Islamic Books', title: 'Islamic Books', query: 'Islamic books' } })}
            />
          )}

          {/* Urdu Novels */}
          {state.novelBooks.length > 0 && (
            <BookRow
              title="Urdu Novels"
              books={state.novelBooks}
              bookSize={110}
              onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'Urdu Novels', title: 'Urdu Novels', query: 'Urdu novels' } })}
            />
          )}

          {/* History */}
          {state.historyBooks.length > 0 && (
            <BookRow
              title="History & Biography"
              books={state.historyBooks}
              bookSize={110}
              onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'History Books', title: 'History & Biography', query: 'history biography' } })}
            />
          )}

          {/* Poetry */}
          {state.poetryBooks.length > 0 && (
            <BookRow
              title="Poetry & Literature"
              books={state.poetryBooks}
              bookSize={110}
              onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'Poetry Books', title: 'Poetry & Literature', query: 'poetry literature' } })}
            />
          )}

          {/* Fun Reads */}
          {state.funnyBooks.length > 0 && (
            <BookRow
              title="Fun Reads"
              books={state.funnyBooks}
              bookSize={110}
              onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'Funny Books', title: 'Fun Reads', query: 'funny humor' } })}
            />
          )}

          {/* PDF Novels */}
          {state.pdfNovels.length > 0 && (
            <BookRow
              title="PDF Novels"
              books={state.pdfNovels}
              bookSize={110}
              onSeeAll={() => router.push({ pathname: '/shelf/[category]', params: { category: 'Urdu Novels', title: 'PDF Novels', query: 'Urdu novels PDF' } })}
            />
          )}

          {/* Popular Writers */}
          {state.popularWriters.length > 0 && (
            <View style={s.section}>
              <View style={[s.sectionHeader, { paddingHorizontal: Spacing.xxl }]}>
                <Text style={[s.sectionTitle, { color: colors.textPrimary }]}>Popular Writers</Text>
                <TouchableOpacity onPress={() => router.push('/shelf')}>
                  <Text style={[s.seeAll, { color: colors.accent }]}>See All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: Spacing.xxl, gap: Spacing.lg }}
              >
                {state.popularWriters.map((author) => (
                  <TouchableOpacity
                    key={author.name}
                    style={s.writerCard}
                    activeOpacity={0.7}
                    onPress={() => router.push({ pathname: '/author/[name]', params: { name: author.name } })}
                  >
                    <View style={[s.writerAvatar, { backgroundColor: colors.card }]}>
                      <Text style={[s.writerInitial, { color: colors.accent }]}>
                        {author.name.charAt(0)}
                      </Text>
                    </View>
                    <Text style={[s.writerName, { color: colors.textPrimary }]} numberOfLines={1}>
                      {author.name}
                    </Text>
                    <Text style={[s.writerBookCount, { color: colors.textSecondary }]}>
                      {author.bookCount} books
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </Animated.View>
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
    backgroundColor: '#E8E0D8',
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
  writerCard: {
    alignItems: 'center',
    width: 76,
    gap: Spacing.xs,
  },
  writerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  writerInitial: {
    fontSize: FontSize.heading3,
    fontWeight: FontWeight.bold,
  },
  writerName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },
  writerBookCount: {
    fontSize: FontSize.xs,
  },
});
