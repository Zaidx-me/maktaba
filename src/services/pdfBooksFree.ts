import { Book } from '../types';
import pdfData from '../data/pdfbooksfree_books_compact.json';

interface CompactBook {
  t: string;
  a: string;
  d: string;
  url: string;
  pdf: string;
  img: string;
  cat: string;
  tags: string[];
}

interface PdfData {
  source: string;
  total: number;
  categories: Record<string, number>;
  books: CompactBook[];
}

const data = pdfData as PdfData;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 60);
}

function compactToBook(book: CompactBook): Book {
  const id = `pdf_${slugify(book.t)}`;
  return {
    id,
    title: book.t,
    authors: book.a ? [book.a] : ['Unknown'],
    description: book.d || '',
    thumbnail: book.img || '',
    publishedDate: '',
    pageCount: 0,
    categories: [book.cat, ...book.tags.slice(0, 3)],
    averageRating: 0,
    ratingsCount: 0,
    previewLink: book.pdf || book.url,
    infoLink: book.url,
    downloadUrl: book.pdf || book.url,
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
      if (!_mainCategoryIndex[raw.cat]) _mainCategoryIndex[raw.cat] = [];
      _mainCategoryIndex[raw.cat].push(compactToBook(raw));
    }
  }
  return _mainCategoryIndex;
}

export function getPdfBooksByMainCategory(mainCategory: string, limit?: number): Book[] {
  const result = getMainCategoryIndex()[mainCategory] || [];
  return limit ? result.slice(0, limit) : result;
}

export function getAllPdfBooks(limit?: number): Book[] {
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

      for (const author of book.authors) {
        const aKey = author.toLowerCase();
        if (!_titleIndex.has(aKey)) _titleIndex.set(aKey, []);
        _titleIndex.get(aKey)!.push(book);
      }
    }
  }
  return _titleIndex;
}

export function searchPdfBooks(query: string, limit: number = 20): Book[] {
  const q = query.toLowerCase();
  const books = getAllBooks();
  const titleIndex = buildTitleIndex();

  const exactMatch = titleIndex.get(q);
  if (exactMatch && exactMatch.length >= limit) return exactMatch.slice(0, limit);

  return books
    .filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.authors.some(a => a.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

export function getPdfMainCategories(): { name: string; count: number }[] {
  return Object.entries(data.categories)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));
}

export function getPdfTopCategories(minCount: number = 10): { name: string; count: number }[] {
  return getPdfMainCategories().filter(c => c.count >= minCount);
}

export function getPdfBookCount(): number {
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

export function getPdfBookById(id: string): Book | null {
  return getIdMap().get(id) || null;
}
