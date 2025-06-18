import { useBooks } from '../hooks/useBooks';
import { useNavigate } from 'react-router-dom';

export default function BooksPage() {
  const { books, loading, error } = useBooks();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 tracking-tight">Libros</h1>
        {loading && <p className="text-center text-gray-400">Cargando libros...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <ul className="space-y-2">
          {books.map(book => (
            <li key={book.id}>
              <button
                className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition font-medium text-blue-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                {book.title}
              </button>
            </li>
          ))}
        </ul>
        {books.length === 0 && !loading && !error && (
          <p className="text-center text-gray-400 mt-8">No hay libros para mostrar.</p>
        )}
      </div>
    </div>
  );
}