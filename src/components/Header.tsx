import { BookOpen, Plus, X } from 'lucide-react';

interface HeaderProps {
  isFormOpen: boolean;
  onToggleForm: () => void;
}

// Uygulamanın üst başlık alanı
function Header({ isFormOpen, onToggleForm }: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-100 sm:text-2xl">
              Book<span className="text-amber-400">Track</span>
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">Kişisel kitap takip listen</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleForm}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          {isFormOpen ? (
            <>
              <X className="h-4 w-4" aria-hidden="true" />
              Formu Kapat
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Kitap Ekle
            </>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;
