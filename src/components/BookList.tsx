import type { Book } from '../interfaces/Book';
import BookCard from './BookCard';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

// Kitap kartlarını duyarlı bir ızgara içinde listeler
function BookList({ books, onEdit, onDelete }: BookListProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default BookList;
