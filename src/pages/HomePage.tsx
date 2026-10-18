import { useCallback, useMemo, useRef, useState } from 'react';
import Header from '../components/Header';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import FilterBar from '../components/FilterBar';
import StatsPanel from '../components/StatsPanel';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEY, parseBooks } from '../utils/storage';
import type { Book, BookFormData, SortOption, StatusFilter } from '../interfaces/Book';
import { READING_STATUSES } from '../interfaces/Book';

// Seçilen sıralama seçeneğine göre karşılaştırma fonksiyonu
function compareBooks(a: Book, b: Book, sort: SortOption): number {
  switch (sort) {
    case 'newest':
      return b.createdAt.localeCompare(a.createdAt);
    case 'oldest':
      return a.createdAt.localeCompare(b.createdAt);
    case 'title':
      return a.title.localeCompare(b.title, 'tr');
    case 'rating':
      // Puanı eşit olanlar kendi içinde başlığa göre sıralanır
      return b.rating - a.rating || a.title.localeCompare(b.title, 'tr');
  }
}

// Uygulamanın ana sayfası: tüm state ve CRUD işlemleri burada yönetilir
function HomePage() {
  const [books, setBooks] = useLocalStorage<Book[]>(STORAGE_KEY, parseBooks);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('tumu');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const formSectionRef = useRef<HTMLElement>(null);

  // Ekleme ve güncelleme
  function handleSubmit(data: BookFormData) {
    const now = new Date().toISOString();

    if (editingBook) {
      setBooks((prev) =>
        prev.map((book) => (book.id === editingBook.id ? { ...book, ...data, updatedAt: now } : book)),
      );
      setEditingBook(null);
    } else {
      const newBook: Book = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
      setBooks((prev) => [newBook, ...prev]);
    }
  }

  function scrollToForm() {
    // Form yeni açıldıysa DOM'a eklenmesini bekle
    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function handleEdit(book: Book) {
    setEditingBook(book);
    setIsFormOpen(true);
    scrollToForm();
  }

  function handleToggleForm() {
    if (isFormOpen) {
      setEditingBook(null);
      setIsFormOpen(false);
    } else {
      setIsFormOpen(true);
      scrollToForm();
    }
  }

  // Silme: onay penceresinde "Sil" seçilince çalışır
  const handleConfirmDelete = useCallback(() => {
    if (!bookToDelete) return;
    setBooks((prev) => prev.filter((book) => book.id !== bookToDelete.id));
    if (editingBook?.id === bookToDelete.id) setEditingBook(null);
    setBookToDelete(null);
  }, [bookToDelete, editingBook, setBooks]);

  const handleCancelDelete = useCallback(() => setBookToDelete(null), []);

  function clearFilters() {
    setStatusFilter('tumu');
    setSearchTerm('');
  }

  // Filtre butonlarında gösterilen durum sayıları
  const counts = useMemo(() => {
    const result = { tumu: books.length } as Record<StatusFilter, number>;
    for (const status of READING_STATUSES) {
      result[status] = books.filter((book) => book.status === status).length;
    }
    return result;
  }, [books]);

  // Listeleme: filtre, arama ve sıralama uygulanmış kitaplar
  const visibleBooks = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase('tr');
    return books
      .filter((book) => statusFilter === 'tumu' || book.status === statusFilter)
      .filter(
        (book) =>
          term === '' ||
          book.title.toLocaleLowerCase('tr').includes(term) ||
          book.author.toLocaleLowerCase('tr').includes(term),
      )
      .sort((a, b) => compareBooks(a, b, sortOption));
  }, [books, statusFilter, searchTerm, sortOption]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header isFormOpen={isFormOpen} onToggleForm={handleToggleForm} />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
        <StatsPanel books={books} />

        {isFormOpen && (
          <section ref={formSectionRef} className="scroll-mt-24">
            <BookForm editingBook={editingBook} onSubmit={handleSubmit} onCancelEdit={() => setEditingBook(null)} />
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">Kitaplığım</h2>
            <span className="text-sm text-slate-500">{visibleBooks.length} kitap gösteriliyor</span>
          </div>

          {books.length > 0 && (
            <FilterBar
              statusFilter={statusFilter}
              searchTerm={searchTerm}
              sortOption={sortOption}
              counts={counts}
              onStatusChange={setStatusFilter}
              onSearchChange={setSearchTerm}
              onSortChange={setSortOption}
            />
          )}

          {books.length === 0 ? (
            <EmptyState
              variant="no-books"
              onAction={() => {
                setIsFormOpen(true);
                scrollToForm();
              }}
            />
          ) : visibleBooks.length === 0 ? (
            <EmptyState variant="no-results" onAction={clearFilters} />
          ) : (
            <BookList books={visibleBooks} onEdit={handleEdit} onDelete={setBookToDelete} />
          )}
        </section>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-600">
        BookTrack · Veriler tarayıcınızda saklanır
      </footer>

      <ConfirmDialog
        isOpen={bookToDelete !== null}
        title="Kitabı sil"
        message={
          bookToDelete
            ? `"${bookToDelete.title}" silinecek. Bu kitabı silmek istediğinize emin misiniz?`
            : 'Bu kitabı silmek istediğinize emin misiniz?'
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default HomePage;
