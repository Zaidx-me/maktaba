import { Book } from '../types';
import urduData from '../data/books_compact.json';

interface CompactBook {
  id: string;
  t: string;
  a: string;
  d: string;
  img: string;
  cat: string[];
  sub: string;
  url: string;
}

interface UrduData {
  source: string;
  total: number;
  categories: Record<string, number>;
  subcategories: Record<string, number>;
  books: CompactBook[];
}

const data = urduData as UrduData;

function compactToBook(book: CompactBook): Book {
  return {
    id: `urdu_${book.id}`,
    title: book.t,
    authors: [book.a],
    description: book.d,
    thumbnail: book.img,
    publishedDate: '',
    pageCount: 0,
    categories: [...book.cat, 'Urdu'],
    averageRating: 0,
    ratingsCount: 0,
    previewLink: book.url,
    infoLink: book.url,
    downloadUrl: book.url,
  };
}

// Lazy-initialized caches — only built when first accessed
let _allBooks: Book[] | null = null;
let _categoryIndex: Record<string, Book[]> | null = null;
let _mainCategoryIndex: Record<string, Book[]> | null = null;

function getAllBooks(): Book[] {
  if (!_allBooks) _allBooks = data.books.map(compactToBook);
  return _allBooks;
}

function getCategoryIndex(): Record<string, Book[]> {
  if (!_categoryIndex) {
    _categoryIndex = {};
    for (const book of getAllBooks()) {
      for (const cat of book.categories) {
        const key = cat.toLowerCase();
        if (!_categoryIndex[key]) _categoryIndex[key] = [];
        _categoryIndex[key].push(book);
      }
    }
  }
  return _categoryIndex;
}

function getMainCategoryIndex(): Record<string, Book[]> {
  if (!_mainCategoryIndex) {
    _mainCategoryIndex = {};
    for (const raw of data.books) {
      for (const cat of raw.cat) {
        if (!_mainCategoryIndex[cat]) _mainCategoryIndex[cat] = [];
        _mainCategoryIndex[cat].push(compactToBook(raw));
      }
    }
  }
  return _mainCategoryIndex;
}

export function getUrduBooksByCategory(category: string, limit?: number): Book[] {
  const key = category.toLowerCase();
  const result = getCategoryIndex()[key] || [];
  return limit ? result.slice(0, limit) : result;
}

export function getUrduBooksByMainCategory(mainCategory: string, limit?: number): Book[] {
  const result = getMainCategoryIndex()[mainCategory] || [];
  return limit ? result.slice(0, limit) : result;
}

export function getAllUrduBooks(limit?: number): Book[] {
  const books = getAllBooks();
  return limit ? books.slice(0, limit) : books;
}

// Pre-built title index for faster search
let _titleIndex: Map<string, Book[]> | null = null;

function buildTitleIndex(): Map<string, Book[]> {
  if (!_titleIndex) {
    _titleIndex = new Map();
    for (const book of getAllBooks()) {
      const key = book.title.toLowerCase();
      if (!_titleIndex.has(key)) _titleIndex.set(key, []);
      _titleIndex.get(key)!.push(book);

      // Also index by author
      for (const author of book.authors) {
        const aKey = author.toLowerCase();
        if (!_titleIndex.has(aKey)) _titleIndex.set(aKey, []);
        _titleIndex.get(aKey)!.push(book);
      }
    }
  }
  return _titleIndex;
}

export function searchUrduBooks(query: string, limit: number = 20): Book[] {
  const q = query.toLowerCase();
  const books = getAllBooks();
  const titleIndex = buildTitleIndex();

  // Try exact index match first (O(1))
  const exactMatch = titleIndex.get(q);
  if (exactMatch && exactMatch.length >= limit) return exactMatch.slice(0, limit);

  // Fallback to filtered search
  return books
    .filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.authors.some(a => a.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

export function getUrduCategories(): string[] {
  return Object.keys(data.categories);
}

export function getUrduMainCategories(): { name: string; count: number }[] {
  return Object.entries(data.categories)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));
}

export function getUrduCategoryCount(category: string): number {
  return data.categories[category] || 0;
}

export function getUrduSubcategories(mainCategory: string): string[] {
  const subs = new Set<string>();
  for (const raw of data.books) {
    if (raw.cat.includes(mainCategory) && raw.sub) {
      subs.add(raw.sub);
    }
  }
  return Array.from(subs).sort();
}

export function getUrduBookCount(): number {
  return data.total;
}

// Build a map for O(1) ID lookup
let _idMap: Map<string, Book> | null = null;

function getIdMap(): Map<string, Book> {
  if (!_idMap) {
    _idMap = new Map();
    for (const book of getAllBooks()) {
      _idMap.set(book.id, book);
    }
  }
  return _idMap;
}

export function getUrduBookById(id: string): Book | null {
  return getIdMap().get(id) || null;
}
