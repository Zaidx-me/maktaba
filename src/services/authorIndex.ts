import { Book } from '../types';
import { getAllUrduBooks } from './urduBooks';
import { getAllPdfBooks } from './pdfBooksFree';

export interface AuthorInfo {
  name: string;
  bookCount: number;
  thumbnail: string;
  books: Book[];
}

let _authorMap: Map<string, AuthorInfo> | null = null;

function isCorruptedAuthor(name: string): boolean {
  if (name.length < 3 || name.length > 50) return true;
  const lower = name.toLowerCase();
  if (lower.includes('this is a') || lower.includes('this book') || lower.includes('this novel')) return true;
  if (lower.includes('the story of') || lower.includes('a beautiful')) return true;
  return false;
}

function normalizeAuthor(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

function buildAuthorMap(): Map<string, AuthorInfo> {
  if (_authorMap) return _authorMap;

  _authorMap = new Map();
  const allBooks = [...getAllUrduBooks(), ...getAllPdfBooks()];

  for (const book of allBooks) {
    const authorName = book.authors?.[0];
    if (!authorName || isCorruptedAuthor(authorName)) continue;

    const key = normalizeAuthor(authorName).toLowerCase();

    if (_authorMap.has(key)) {
      const existing = _authorMap.get(key)!;
      existing.books.push(book);
      existing.bookCount = existing.books.length;
      if (!existing.thumbnail && book.thumbnail) {
        existing.thumbnail = book.thumbnail;
      }
    } else {
      _authorMap.set(key, {
        name: normalizeAuthor(authorName),
        bookCount: 1,
        thumbnail: book.thumbnail || '',
        books: [book],
      });
    }
  }

  return _authorMap;
}

export function getAuthors(): AuthorInfo[] {
  const map = buildAuthorMap();
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getPopularAuthors(limit: number = 15): AuthorInfo[] {
  const map = buildAuthorMap();
  return Array.from(map.values())
    .sort((a, b) => b.bookCount - a.bookCount)
    .slice(0, limit);
}

export function getBooksByAuthor(authorName: string): Book[] {
  const map = buildAuthorMap();
  const key = authorName.toLowerCase();
  const entry = map.get(key);
  return entry ? entry.books : [];
}

export function searchAuthors(query: string, limit: number = 50): AuthorInfo[] {
  const q = query.toLowerCase();
  return getAuthors()
    .filter(a => a.name.toLowerCase().includes(q))
    .slice(0, limit);
}
