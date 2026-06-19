import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { BookCard } from './BookCard';
import { SectionHeader } from './SectionHeader';
import { SkeletonRow } from './SkeletonLoader';
import { Book } from '../types';
import { Spacing } from '../constants/theme';

interface BookRowProps {
  title: string;
  label?: string;
  books: Book[];
  loading?: boolean;
  bookSize?: number;
  onSeeAll?: () => void;
}

function areBooksEqual(a: Book[], b: Book[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || a[i].thumbnail !== b[i].thumbnail) return false;
  }
  return true;
}

function areRowPropsEqual(prev: BookRowProps, next: BookRowProps) {
  return prev.title === next.title
    && prev.label === next.label
    && prev.loading === next.loading
    && prev.bookSize === next.bookSize
    && prev.onSeeAll === next.onSeeAll
    && areBooksEqual(prev.books, next.books);
}

export const BookRow = React.memo(function BookRow({ title, label, books, loading, bookSize = 140, onSeeAll }: BookRowProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <SectionHeader label={label} title={title} />
        <SkeletonRow />
      </View>
    );
  }

  if (books.length === 0) return null;

  return (
    <View style={styles.container}>
      <SectionHeader label={label} title={title} onSeeAll={onSeeAll} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {books.map((book) => (
          <View key={book.id} style={[styles.bookWrapper, { width: bookSize }]}>
            <BookCard book={book} size={bookSize} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}, areRowPropsEqual);

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xxl,
  },
  scrollContent: {
    gap: Spacing.md,
  },
  bookWrapper: {
    marginRight: Spacing.sm,
  },
});
