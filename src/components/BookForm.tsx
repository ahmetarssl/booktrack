import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Pencil, Plus, Star } from 'lucide-react';
import type { Book, BookFormData, ReadingStatus } from '../interfaces/Book';
import { READING_STATUSES, STATUS_LABELS } from '../interfaces/Book';

interface BookFormProps {
  editingBook: Book | null;
  onSubmit: (data: BookFormData) => void;
  onCancelEdit: () => void;
}

// Sayı alanları yazım sırasında boş kalabildiği için form içinde metin olarak tutulur
interface FormValues {
  title: string;
  author: string;
  pageCount: string;
  currentPage: string;
  status: ReadingStatus;
  rating: number;
  notes: string;
}

type FormErrors = Partial<Record<'title' | 'author' | 'pageCount' | 'currentPage', string>>;

const EMPTY_VALUES: FormValues = {
  title: '',
  author: '',
  pageCount: '',
  currentPage: '0',
  status: 'okunacak',
  rating: 0,
  notes: '',
};

function toFormValues(book: Book): FormValues {
  return {
    title: book.title,
    author: book.author,
    pageCount: String(book.pageCount),
    currentPage: String(book.currentPage),
    status: book.status,
    rating: book.rating,
    notes: book.notes,
  };
}

// Form alanlarını doğrular, hatalı alanlar için Türkçe mesaj döner
function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const pageCount = Number(values.pageCount);
  const currentPage = values.currentPage.trim() === '' ? 0 : Number(values.currentPage);

  if (values.title.trim() === '') {
    errors.title = 'Kitap başlığı boş bırakılamaz.';
  }
  if (values.author.trim() === '') {
    errors.author = 'Yazar adı boş bırakılamaz.';
  }

  if (values.pageCount.trim() === '' || !Number.isInteger(pageCount)) {
    errors.pageCount = 'Geçerli bir sayfa sayısı girin (tam sayı).';
  } else if (pageCount < 1) {
    errors.pageCount = 'Sayfa sayısı 1\'den küçük olamaz.';
  }

  if (!Number.isInteger(currentPage)) {
    errors.currentPage = 'Okunan sayfa tam sayı olmalıdır.';
  } else if (currentPage < 0) {
    errors.currentPage = 'Okunan sayfa negatif olamaz.';
  } else if (!errors.pageCount && currentPage > pageCount) {
    errors.currentPage = `Okunan sayfa, toplam sayfa sayısını (${pageCount}) aşamaz.`;
  }

  return errors;
}

const inputBase =
  'w-full rounded-lg border bg-slate-950 px-3 py-2 text-slate-200 placeholder:text-slate-600 transition-colors focus:outline-none focus:ring-2';

function inputClass(hasError: boolean): string {
  return `${inputBase} ${
    hasError
      ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
      : 'border-slate-800 focus:border-amber-500 focus:ring-amber-500/30'
  }`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-400">
      {message}
    </p>
  );
}

// Hem kitap ekleme hem de düzenleme için kullanılan form
function BookForm({ editingBook, onSubmit, onCancelEdit }: BookFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hoverRating, setHoverRating] = useState(0);

  const isEditing = editingBook !== null;

  // Düzenlenecek kitap değiştiğinde formu doldur ya da temizle
  useEffect(() => {
    setValues(editingBook ? toFormValues(editingBook) : EMPTY_VALUES);
    setErrors({});
  }, [editingBook]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // "Okundu" seçilirse okunan sayfa otomatik olarak toplam sayfaya eşitlenir
      if (name === 'status' && value === 'okundu' && prev.pageCount.trim() !== '') {
        next.currentPage = prev.pageCount;
      }
      return next;
    });

    // Kullanıcı alanı düzelttikçe o alana ait hata mesajını kaldır
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleRating(star: number) {
    // Seçili yıldıza tekrar tıklanırsa puan sıfırlanır
    setValues((prev) => ({ ...prev, rating: prev.rating === star ? 0 : star }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      title: values.title.trim(),
      author: values.author.trim(),
      pageCount: Number(values.pageCount),
      currentPage: values.currentPage.trim() === '' ? 0 : Number(values.currentPage),
      status: values.status,
      rating: values.rating,
      notes: values.notes.trim(),
    });

    // Gönderimden sonra formu temizle
    setValues(EMPTY_VALUES);
    setErrors({});
  }

  const displayedRating = hoverRating || values.rating;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`rounded-xl border bg-slate-900 p-5 sm:p-6 ${
        isEditing ? 'border-amber-500/50' : 'border-slate-800'
      }`}
    >
      <div className="mb-5 flex items-center gap-2">
        {isEditing ? (
          <Pencil className="h-5 w-5 text-amber-400" aria-hidden="true" />
        ) : (
          <Plus className="h-5 w-5 text-amber-400" aria-hidden="true" />
        )}
        <h2 className="text-lg font-bold text-slate-100">
          {isEditing ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-400">
            Başlık
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            placeholder="Örn. Kürk Mantolu Madonna"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            className={inputClass(Boolean(errors.title))}
          />
          <FieldError id="title-error" message={errors.title} />
        </div>

        <div>
          <label htmlFor="author" className="mb-1.5 block text-sm font-medium text-slate-400">
            Yazar
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={values.author}
            onChange={handleChange}
            placeholder="Örn. Sabahattin Ali"
            aria-invalid={Boolean(errors.author)}
            aria-describedby={errors.author ? 'author-error' : undefined}
            className={inputClass(Boolean(errors.author))}
          />
          <FieldError id="author-error" message={errors.author} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pageCount" className="mb-1.5 block text-sm font-medium text-slate-400">
              Sayfa Sayısı
            </label>
            <input
              id="pageCount"
              name="pageCount"
              type="number"
              min={1}
              inputMode="numeric"
              value={values.pageCount}
              onChange={handleChange}
              placeholder="320"
              aria-invalid={Boolean(errors.pageCount)}
              aria-describedby={errors.pageCount ? 'pageCount-error' : undefined}
              className={inputClass(Boolean(errors.pageCount))}
            />
            <FieldError id="pageCount-error" message={errors.pageCount} />
          </div>

          <div>
            <label htmlFor="currentPage" className="mb-1.5 block text-sm font-medium text-slate-400">
              Okunan Sayfa
            </label>
            <input
              id="currentPage"
              name="currentPage"
              type="number"
              min={0}
              inputMode="numeric"
              value={values.currentPage}
              onChange={handleChange}
              placeholder="0"
              aria-invalid={Boolean(errors.currentPage)}
              aria-describedby={errors.currentPage ? 'currentPage-error' : undefined}
              className={inputClass(Boolean(errors.currentPage))}
            />
            <FieldError id="currentPage-error" message={errors.currentPage} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-400">
              Durum
            </label>
            <select
              id="status"
              name="status"
              value={values.status}
              onChange={handleChange}
              className={inputClass(false)}
            >
              {READING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-400">Puan</span>
            <div
              className="flex h-[42px] items-center gap-1"
              role="radiogroup"
              aria-label="Puan"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={values.rating === star}
                  aria-label={`${star} yıldız`}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= displayedRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-400">
            Notlar
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={values.notes}
            onChange={handleChange}
            placeholder="Kitap hakkındaki düşüncelerin, sevdiğin alıntılar..."
            className={`${inputClass(false)} resize-y`}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800"
          >
            Vazgeç
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          {isEditing ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
    </form>
  );
}

export default BookForm;
