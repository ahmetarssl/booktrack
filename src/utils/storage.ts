import type { Book } from '../interfaces/Book';
import { READING_STATUSES } from '../interfaces/Book';

// Kitapların LocalStorage'da tutulduğu anahtar
export const STORAGE_KEY = 'booktrack_books';

// LocalStorage'dan ham metni okur; erişim engellenmişse (ör. gizli mod) null döner
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

// Değeri JSON'a çevirip LocalStorage'a yazar
export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('LocalStorage yazma hatası:', error);
  }
}

// Bir nesnenin geçerli bir kitap kaydı olup olmadığını kontrol eder
function isBook(value: unknown): value is Book {
  if (typeof value !== 'object' || value === null) return false;
  const book = value as Record<string, unknown>;
  return (
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    typeof book.author === 'string' &&
    typeof book.pageCount === 'number' &&
    typeof book.currentPage === 'number' &&
    typeof book.rating === 'number' &&
    typeof book.notes === 'string' &&
    typeof book.createdAt === 'string' &&
    typeof book.updatedAt === 'string' &&
    READING_STATUSES.includes(book.status as Book['status'])
  );
}

// Ham LocalStorage verisini kitap dizisine çevirir.
// Kayıt hiç yoksa (ilk açılış) örnek kitaplar, veri bozuksa boş dizi döner.
export function parseBooks(raw: string | null): Book[] {
  if (raw === null) return getSampleBooks();

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isBook);
  } catch (error) {
    console.warn('LocalStorage verisi okunamadı, boş liste ile başlanıyor:', error);
    return [];
  }
}

// Belirtilen gün kadar önceki tarihi ISO formatında döner
function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

// İlk açılışta gösterilecek örnek kitaplar
export function getSampleBooks(): Book[] {
  return [
    {
      id: crypto.randomUUID(),
      title: 'Kürk Mantolu Madonna',
      author: 'Sabahattin Ali',
      pageCount: 160,
      currentPage: 160,
      status: 'okundu',
      rating: 5,
      notes: 'Raif Efendi ile Maria Puder\'in hikâyesi. Sessiz bir adamın iç dünyasını bu kadar derin anlatan az kitap var.',
      createdAt: daysAgo(30),
      updatedAt: daysAgo(12),
    },
    {
      id: crypto.randomUUID(),
      title: 'Tutunamayanlar',
      author: 'Oğuz Atay',
      pageCount: 724,
      currentPage: 310,
      status: 'okunuyor',
      rating: 4,
      notes: 'Selim Işık\'ın defterleri bölümündeyim. Yavaş ama keyifli ilerliyor.',
      createdAt: daysAgo(20),
      updatedAt: daysAgo(1),
    },
    {
      id: crypto.randomUUID(),
      title: 'Saatleri Ayarlama Enstitüsü',
      author: 'Ahmet Hamdi Tanpınar',
      pageCount: 382,
      currentPage: 140,
      status: 'birakildi',
      rating: 3,
      notes: 'İlk yarısı çok iyiydi, sonra ara verdim. İleride tekrar başlayabilirim.',
      createdAt: daysAgo(14),
      updatedAt: daysAgo(7),
    },
    {
      id: crypto.randomUUID(),
      title: 'Suç ve Ceza',
      author: 'Fyodor Dostoyevski',
      pageCount: 687,
      currentPage: 0,
      status: 'okunacak',
      rating: 0,
      notes: '',
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
  ];
}
