import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Book } from '../types';
import { Spacing, FontSize, BorderRadius, Shadows } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { BookCoverPlaceholder, BookSkeleton } from './BookCoverPlaceholder';

interface BookCardProps {
  book: Book;
  onPress?: () => void;
  size?: number;
  loading?: boolean;
}

export const BookCard = React.memo(function BookCard({ book, onPress, size = 140, loading }: BookCardProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/book/${book.id}`);
    }
  };

  const imageHeight = size * 1.4;

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
      <View style={[styles.imageContainer, { width: size, height: imageHeight, borderRadius: BorderRadius.lg }]}>
        {book.thumbnail ? (
          <Image
            source={{ uri: book.thumbnail, cache: 'force-cache' }}
            style={styles.image}
            fadeDuration={300}
            resizeMode="cover"
          />
        ) : (
          <BookCoverPlaceholder title={book.title} width={size} height={imageHeight} />
        )}
        <View style={styles.spine} />
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
    marginBottom: Spacing.md,
  },
  imageContainer: {
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  title: {
    fontSize: FontSize.bodySmMedium,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  author: {
    fontSize: FontSize.sm,
    fontWeight: '400',
    marginTop: Spacing.xxs,
    letterSpacing: 0.1,
  },
});
