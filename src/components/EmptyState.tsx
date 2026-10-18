import { BookPlus, SearchX } from 'lucide-react';

interface EmptyStateProps {
  // "no-books": hiç kitap yok, "no-results": filtre sonucu boş
  variant: 'no-books' | 'no-results';
  onAction?: () => void;
}

// Liste boş olduğunda gösterilen bilgilendirme alanı
function EmptyState({ variant, onAction }: EmptyStateProps) {
  const isNoBooks = variant === 'no-books';
  const Icon = isNoBooks ? BookPlus : SearchX;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">
        {isNoBooks ? 'Kitaplığın henüz boş' : 'Sonuç bulunamadı'}
      </h3>
      <p className="mt-2 max-w-sm text-slate-500">
        {isNoBooks
          ? 'Okuduğun, okumak istediğin ya da yarıda bıraktığın ilk kitabı ekleyerek başla.'
          : 'Seçtiğin filtre veya arama ile eşleşen bir kitap yok. Filtreleri temizleyip tekrar deneyebilirsin.'}
      </p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-lg border border-amber-500/50 px-4 py-2 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-500/10"
        >
          {isNoBooks ? 'İlk kitabını ekle' : 'Filtreleri temizle'}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
