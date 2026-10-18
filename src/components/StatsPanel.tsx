import type { LucideIcon } from 'lucide-react';
import { BookCheck, Library, FileText, Star } from 'lucide-react';
import type { Book } from '../interfaces/Book';

interface StatsPanelProps {
  books: Book[];
}

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

// Kitap listesine ait özet istatistikleri gösterir
function StatsPanel({ books }: StatsPanelProps) {
  const finishedCount = books.filter((book) => book.status === 'okundu').length;
  const totalPagesRead = books.reduce((sum, book) => sum + book.currentPage, 0);

  // Ortalama puan yalnızca puanlanmış kitaplar üzerinden hesaplanır
  const ratedBooks = books.filter((book) => book.rating > 0);
  const averageRating =
    ratedBooks.length > 0
      ? (ratedBooks.reduce((sum, book) => sum + book.rating, 0) / ratedBooks.length).toLocaleString('tr-TR', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : '—';

  const stats: StatItem[] = [
    { label: 'Toplam Kitap', value: books.length.toLocaleString('tr-TR'), icon: Library },
    { label: 'Okunan Kitap', value: finishedCount.toLocaleString('tr-TR'), icon: BookCheck },
    { label: 'Okunan Sayfa', value: totalPagesRead.toLocaleString('tr-TR'), icon: FileText },
    { label: 'Ortalama Puan', value: averageRating, icon: Star },
  ];

  return (
    <section aria-label="İstatistikler" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-slate-500">
            <Icon className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide sm:text-sm sm:normal-case sm:tracking-normal">
              {label}
            </span>
          </div>
          <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-100 sm:text-3xl">{value}</p>
        </div>
      ))}
    </section>
  );
}

export default StatsPanel;
