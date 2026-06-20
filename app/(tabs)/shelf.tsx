import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ListRenderItem, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { BookRow } from '../../src/components/BookRow';
import { SkeletonRow } from '../../src/components/SkeletonLoader';
import { RequestBookModal } from '../../src/components/RequestBookModal';
import { Book } from '../../src/types';
import { useTheme } from '../../src/context/ThemeContext';
import { getUrduBooksByMainCategory, getUrduMainCategories } from '../../src/services/urduBooks';
import { getPdfBooksByMainCategory, getPdfTopCategories } from '../../src/services/pdfBooksFree';
import { getAuthors, searchAuthors, AuthorInfo } from '../../src/services/authorIndex';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../../src/constants/theme';

type Tab = 'urdu' | 'pdf' | 'writers';

interface RowDef {
  title: string;
  key: string;
  query: string;
  shelfKey: string;
}

function AuthorItem({ author, colors, onPress }: { author: AuthorInfo; colors: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.authorRow, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.authorThumb, { backgroundColor: colors.inputBg }]}>
        {author.thumbnail ? (
          <Image source={{ uri: author.thumbnail }} style={styles.authorThumbImg} contentFit="cover" transition={150} cachePolicy="memory-disk" />
        ) : (
          <MaterialIcons name="person" size={24} color={colors.textMuted} />
        )}
      </View>
      <View style={styles.authorInfo}>
        <Text style={[styles.authorName, { color: colors.textPrimary }]} numberOfLines={1}>{author.name}</Text>
        <Text style={[styles.authorCount, { color: colors.textMuted }]}>
          {author.bookCount} {author.bookCount === 1 ? 'book' : 'books'}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function CollectionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const scrollRef = useRef<FlatList>(null);
  const [activeTab, setActiveTab] = useState<Tab>('urdu');
  const [rowData, setRowData] = useState<Record<string, Book[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [authorSearch, setAuthorSearch] = useState('');
  const [allAuthors, setAllAuthors] = useState<AuthorInfo[]>([]);
  const nav = useNavigation();
  const lastTapRef = useRef(0);

  useEffect(() => {
    const unsub = (nav as any).addListener('tabPress', () => {
      const now = Date.now();
      if (now - lastTapRef.current < 400) {
        scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
      }
    });
    return unsub;
  }, [nav]);

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'urdu', label: 'Urdu Books', icon: 'menu-book' },
    { key: 'pdf', label: 'PDF Books', icon: 'description' },
    { key: 'writers', label: 'Writers', icon: 'people' },
  ];

  const ROWS = useMemo<Record<Tab, RowDef[]>>(() => ({
    urdu: getUrduMainCategories().map(c => ({
      title: c.name, key: `urdu_${c.name}`, query: c.name,
      shelfKey: `urdu_${c.name.toLowerCase().replace(/\s+/g, '_')}`,
    })),
    pdf: getPdfTopCategories(8).map(c => ({
      title: c.name, key: `pdf_${c.name}`, query: c.name,
      shelfKey: `pdf_${c.name.toLowerCase().replace(/\s+/g, '_')}`,
    })),
    writers: [],
  }), []);

  const currentRows = ROWS[activeTab];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'writers') {
        const authors = authorSearch ? searchAuthors(authorSearch, 100) : getAuthors();
        setAllAuthors(authors);
      } else {
        const results = await Promise.allSettled(
          currentRows.map(row =>
            activeTab === 'urdu'
              ? Promise.resolve(getUrduBooksByMainCategory(row.query, 20))
              : Promise.resolve(getPdfBooksByMainCategory(row.query, 20))
          )
        );
        const data: Record<string, Book[]> = {};
        currentRows.forEach((row, i) => {
          if (results[i].status === 'fulfilled') {
            data[row.key] = results[i].value.filter((b: Book) => b.thumbnail);
          } else {
            data[row.key] = [];
          }
        });
        setRowData(data);
      }
    } catch {}
    setLoading(false);
  }, [activeTab, currentRows, authorSearch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleSeeAll = useCallback((row: RowDef) => {
    router.push({
      pathname: '/shelf/[category]',
      params: { category: row.shelfKey, title: row.title, query: row.query },
    });
  }, [router]);

  const renderBookRow = useCallback<ListRenderItem<RowDef>>(({ item }) => (
    <BookRow
      title={item.title}
      books={rowData[item.key] || []}
      bookSize={130}
      onSeeAll={() => handleSeeAll(item)}
    />
  ), [rowData, handleSeeAll]);

  const renderAuthor = useCallback<ListRenderItem<AuthorInfo>>(({ item }) => (
    <AuthorItem
      author={item}
      colors={colors}
      onPress={() => router.push({ pathname: '/author/[name]', params: { name: item.name } })}
    />
  ), [colors, router]);

  const headerComponent = useMemo(() => (
    <View style={{ paddingHorizontal: Spacing.xxl, marginBottom: Spacing.lg }}>
      <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Collections</Text>

      <View style={styles.tabRow}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                isActive && { backgroundColor: colors.textPrimary, borderColor: colors.textPrimary },
              ]}
              onPress={() => { setActiveTab(tab.key); setRowData({}); setAuthorSearch(''); }}
              activeOpacity={0.7}
            >
              <MaterialIcons name={tab.icon as any} size={16} color={isActive ? colors.background : colors.textSecondary} />
              <Text style={[styles.tabLabel, { color: isActive ? colors.background : colors.textSecondary }, isActive && { fontWeight: '700' }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === 'writers' && (
        <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <MaterialIcons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search writers..."
            placeholderTextColor={colors.textMuted}
            value={authorSearch}
            onChangeText={setAuthorSearch}
            returnKeyType="search"
          />
          {authorSearch.length > 0 && (
            <TouchableOpacity onPress={() => setAuthorSearch('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="close" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {activeTab !== 'writers' && (
        <TouchableOpacity
          style={[styles.requestBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
          onPress={() => setShowRequest(true)}
          activeOpacity={0.7}
        >
          <MaterialIcons name="add-circle-outline" size={18} color={colors.textPrimary} />
          <Text style={[styles.requestBtnText, { color: colors.textSecondary }]}>Can't find a book? Request it</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [colors, activeTab, authorSearch]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ paddingTop: insets.top + Spacing.md }}>
          {headerComponent}
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {activeTab === 'writers' ? (
        <FlatList
          ref={scrollRef}
          data={allAuthors}
          keyExtractor={item => item.name}
          renderItem={renderAuthor}
          ListHeaderComponent={headerComponent}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing.md }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.textSecondary} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialIcons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No writers found</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          ref={scrollRef}
          data={currentRows}
          keyExtractor={item => item.key}
          renderItem={renderBookRow}
          ListHeaderComponent={headerComponent}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing.md }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.textSecondary} />}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          windowSize={4}
          initialNumToRender={4}
          maxToRenderPerBatch={4}
        />
      )}
      <RequestBookModal visible={showRequest} onClose={() => setShowRequest(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  pageTitle: { fontSize: FontSize.heading3, fontWeight: '800', letterSpacing: -0.5, marginBottom: Spacing.md },
  tabRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full, borderWidth: 1,
  },
  tabLabel: { fontSize: FontSize.sm, fontWeight: '500' },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.md,
    height: 44, borderWidth: StyleSheet.hairlineWidth, marginBottom: Spacing.md,
  },
  searchInput: { flex: 1, fontSize: FontSize.bodyMd, paddingVertical: 0 },
  requestBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.sm + 2, borderRadius: BorderRadius.md, borderWidth: 1, marginBottom: Spacing.lg,
  },
  requestBtnText: { fontSize: FontSize.sm, fontWeight: '500' },
  authorRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  authorThumb: {
    width: 48, height: 48, borderRadius: BorderRadius.xl,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  authorThumbImg: { width: '100%', height: '100%' },
  authorInfo: { flex: 1 },
  authorName: { fontSize: FontSize.bodyMdMedium, fontWeight: FontWeight.semibold },
  authorCount: { fontSize: FontSize.sm, marginTop: 2 },
  emptyWrap: { alignItems: 'center', paddingTop: 80, gap: Spacing.md },
  emptyText: { fontSize: FontSize.bodyMd, fontWeight: FontWeight.regular },
});
