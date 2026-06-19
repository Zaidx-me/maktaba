import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Book } from '../types';
import { Spacing, FontSize, FontWeight, BorderRadius, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { BookCoverPlaceholder, BookSkeleton } from './BookCoverPlaceholder';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
  size?: number;
  loading?: boolean;
}

export const BookCard = React.memo(function BookCard({ book, onPress, size = 120, loading }: BookCardProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/book/${book.id}`);
    }
  };

  const imageHeight = size * 1.45;

  if (loading) {
    return (
      <View style={[styles.card, { width: size }]}>
        <BookSkeleton width={size} height={imageHeight} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { width: size }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, { width: size, height: imageHeight, borderRadius: BorderRadius.md }]}>
        {book.thumbnail ? (
          <Image
            source={{ uri: book.thumbnail, cache: 'force-cache' }}
            style={styles.image}
            fadeDuration={200}
            resizeMode="cover"
          />
        ) : (
          <BookCoverPlaceholder title={book.title} width={size} height={imageHeight} />
        )}
      </View>
      <Text
        style={[styles.title, { color: colors.textPrimary }]}
        numberOfLines={2}
      >
        {book.title}
      </Text>
      {book.authors?.[0] && (
        <Text style={[styles.author, { color: colors.textSecondary }]} numberOfLines={1}>
          {book.authors[0]}
        </Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.sm,
  },
  imageContainer: {
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  author: {
    fontSize: FontSize.xs,
    marginTop: 1,
  },
});
