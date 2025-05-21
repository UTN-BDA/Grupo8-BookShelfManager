import { BookCard } from '../components/BookCard';
import { useBooks } from '../hooks/useBooks';

export default function BooksPage() {
  const { books, loading, error } = useBooks();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Libros</h1>
      {loading && <p>Cargando libros...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
