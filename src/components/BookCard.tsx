import { Pencil, Star, Trash2 } from 'lucide-react';
import type { Book, ReadingStatus } from '../interfaces/Book';
import { STATUS_LABELS } from '../interfaces/Book';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

// Durum rozetlerinin renkleri
const STATUS_STYLES: Record<ReadingStatus, string> = {
  okunacak: 'bg-slate-500/15 text-slate-300 ring-slate-500/30',
  okunuyor: 'bg-blue-500/15 text-blue-300 ring-blue-500/30',
  okundu: 'bg-green-500/15 text-green-300 ring-green-500/30',
  birakildi: 'bg-red-500/15 text-red-300 ring-red-500/30',
};

const NOTE_PREVIEW_LENGTH = 110;

// Uzun notları kelime ortasında kesmeden kısaltır
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Tek bir kitabı gösteren kart
function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const progress = book.pageCount > 0 ? Math.round((book.currentPage / book.pageCount) * 100) : 0;

  return (
    <article className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20 transition-transform duration-200 hover:-translate-y-1 hover:border-slate-700">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[book.status]}`}
        >
          {STATUS_LABELS[book.status]}
        </span>

        <div className="flex items-center gap-0.5" aria-label={book.rating > 0 ? `${book.rating} / 5 puan` : 'Puanlanmamış'}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= book.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <h3 className="text-lg font-bold leading-snug text-slate-100">{book.title}</h3>
      <p className="mt-0.5 text-sm text-slate-500">{book.author}</p>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-slate-500">
          <span>
            {book.currentPage} / {book.pageCount} sayfa
          </span>
          <span className="font-semibold text-slate-400">%{progress}</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-800"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Okuma ilerlemesi"
        >
          <div className="h-full rounded-full bg-amber-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {book.notes && (
        <p className="mt-4 border-l-2 border-amber-500/40 pl-3 text-sm italic text-slate-400" title={book.notes}>
          {truncate(book.notes, NOTE_PREVIEW_LENGTH)}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-5">
        <span className="text-xs text-slate-600">{formatDate(book.createdAt)}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-amber-500/60 hover:text-amber-400"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Düzenle
          </button>
          <button
            type="button"
            onClick={() => onDelete(book)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-red-500/60 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Sil
          </button>
        </div>
      </div>
    </article>
  );
}

export default BookCard;
