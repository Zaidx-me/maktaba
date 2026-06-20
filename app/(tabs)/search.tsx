import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BookCard } from '../../src/components/BookCard';
import { RequestBookModal } from '../../src/components/RequestBookModal';
import { Book } from '../../src/types';
import { searchUrduBooks } from '../../src/services/urduBooks';
import { searchPdfBooks } from '../../src/services/pdfBooksFree';
import { Spacing, FontSize, BorderRadius } from '../../src/constants/theme';
import { useTheme } from '../../src/context/ThemeContext';

function searchAllBooks(query: string, limit: number = 30): Book[] {
  const urdu = searchUrduBooks(query, limit);
  const pdf = searchPdfBooks(query, limit);
  const seen = new Set<string>();
  const result: Book[] = [];
  for (const b of [...urdu, ...pdf]) {
    if (!seen.has(b.id)) { seen.add(b.id); result.push(b); }
  }
  return result.slice(0, limit);
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { q: initialQuery } = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  useEffect(() => {
    if (initialQuery) handleSearch(initialQuery);
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const books = searchAllBooks(searchQuery);
      setResults(books);
    } catch {}
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Search</Text>
        <View style={[styles.searchContainer, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search books, authors..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <MaterialIcons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.buttonPrimary} style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsList}
          columnWrapperStyle={results.length > 0 ? styles.resultsRow : undefined}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <BookCard book={item} />
            </View>
          )}
          ListEmptyComponent={
            searched ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="search" size={64} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textPrimary }]}>No books found</Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Try a different search term</Text>
                <TouchableOpacity
                  style={[styles.requestBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
                  onPress={() => setShowRequest(true)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="add-circle-outline" size={20} color={colors.textPrimary} />
                  <Text style={[styles.requestBtnText, { color: colors.textPrimary }]}>Request This Book</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="search" size={64} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textPrimary }]}>Search for books</Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Find your next great read</Text>
              </View>
            )
          }
        />
      )}

      <RequestBookModal visible={showRequest} onClose={() => setShowRequest(false)} prefilledTitle={query} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.xxl, paddingBottom: Spacing.lg },
  title: { fontSize: FontSize.heading3, fontWeight: '800', marginBottom: Spacing.lg },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md, gap: Spacing.sm, borderWidth: 1,
  },
  searchInput: { flex: 1, height: 48, fontSize: FontSize.bodyMd },
  loader: { flex: 1, justifyContent: 'center' },
  resultsList: { paddingHorizontal: Spacing.xxl, paddingBottom: 100 },
  resultsRow: { justifyContent: 'space-between' },
  bookItem: { width: '48%' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { fontSize: FontSize.heading5, fontWeight: '600', marginTop: Spacing.lg },
  emptySubtext: { fontSize: FontSize.bodyMd, marginTop: Spacing.sm },
  requestBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, borderWidth: 1, marginTop: Spacing.xxl,
  },
  requestBtnText: { fontSize: FontSize.bodyMd, fontWeight: '600' },
});
