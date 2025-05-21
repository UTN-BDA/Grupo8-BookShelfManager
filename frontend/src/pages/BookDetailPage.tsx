import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { books, loading, error } = useBooks();
  const book = books.find(b => b.id === id);
  const navigate = useNavigate();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400">Cargando libro...</p>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-red-500">{error}</p>
    </div>
  );
  if (!book) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400">Libro no encontrado.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <button
          className="mb-6 text-blue-600 hover:underline text-sm"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">{book.title}</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Autor:</span> {book.author}</p>
          <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
          <p><span className="font-semibold">Editorial:</span> {book.publisher}</p>
          <p><span className="font-semibold">Idioma:</span> {book.language}</p>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold">Publicado:</span> {new Date(book.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}