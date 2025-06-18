import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import type { Book } from '../services/bookService';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bookService.getBookById(id)
      .then(setBook)
      .catch(() => setError('Libro no encontrado'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400">Cargando libro...</p>
    </div>
  );
  if (error || !book) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Libro no encontrado</h2>
        <p className="text-gray-500 mb-6">No pudimos encontrar el libro que estás buscando.</p>
        <button
          onClick={() => navigate('/libros')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          Volver a la lista
        </button>
      </div>
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










