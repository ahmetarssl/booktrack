// Kitabın okuma durumu
export type ReadingStatus = 'okunacak' | 'okunuyor' | 'okundu' | 'birakildi';

export interface Book {
  id: string;
  title: string;
  author: string;
  pageCount: number;
  currentPage: number;
  status: ReadingStatus;
  rating: number; // 0-5 arası, 0 = puanlanmamis
  notes: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface BookFormData {
  title: string;
  author: string;
  pageCount: number;
  currentPage: number;
  status: ReadingStatus;
  rating: number;
  notes: string;
}

// Filtre çubuğunda kullanılan durum filtresi ("tumu" = filtre yok)
export type StatusFilter = ReadingStatus | 'tumu';

// Liste sıralama seçenekleri
export type SortOption = 'newest' | 'oldest' | 'title' | 'rating';

// Durumların arayüzde görünen Türkçe karşılıkları
export const STATUS_LABELS: Record<ReadingStatus, string> = {
  okunacak: 'Okunacak',
  okunuyor: 'Okunuyor',
  okundu: 'Okundu',
  birakildi: 'Bırakıldı',
};

export const READING_STATUSES: ReadingStatus[] = ['okunacak', 'okunuyor', 'okundu', 'birakildi'];
