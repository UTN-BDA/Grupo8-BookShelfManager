import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import type { Book } from '../services/bookService';
import { reviewService, type Review } from '../services/reviewService';
import { coverService } from '../services/coverService';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bookService.getBookById(id)
      .then(setBook)
      .catch(() => setError('Libro no encontrado'))
      .finally(() => setLoading(false));
    // Cargar portada
    coverService.getCover(id)
      .then(blob => setCoverUrl(URL.createObjectURL(blob)))
      .catch(() => setCoverUrl(null));
    // Cargar reviews
    reviewService.getReviewsByBookId(id)
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !reviewText.trim()) return;
    setReviewLoading(true);
    const userId = 'demo-user';
    const username = 'Demo';
    await reviewService.addReview({ bookId: id, userId, username, content: reviewText });
    setReviewText('');
    // Recargar reviews
    const updated = await reviewService.getReviewsByBookId(id);
    setReviews(updated);
    setReviewLoading(false);
  };

  const handleCoverUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    const fileInput = (e.currentTarget.elements.namedItem('cover') as HTMLInputElement);
    if (!fileInput?.files?.[0]) return;
    setUploadingCover(true);
    setCoverError(null);
    try {
      await coverService.uploadCover(id, fileInput.files[0]);
      // Refrescar portada
      const blob = await coverService.getCover(id);
      setCoverUrl(URL.createObjectURL(blob));
    } catch {
      setCoverError('Error al subir la portada');
    } finally {
      setUploadingCover(false);
    }
  };

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
        {coverUrl && (
          <img src={coverUrl} alt="Portada" className="mb-4 w-40 h-60 object-cover rounded shadow" />
        )}
        <form onSubmit={handleCoverUpload} className="mb-4 flex items-center gap-2">
          <input type="file" name="cover" accept="image/*" className="border rounded p-1" disabled={uploadingCover} />
          <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" disabled={uploadingCover}>Subir portada</button>
        </form>
        {coverError && <div className="text-red-500 mb-2">{coverError}</div>}
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Autor:</span> {book.author}</p>
          <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
          <p><span className="font-semibold">Editorial:</span> {book.publisher}</p>
          <p><span className="font-semibold">Idioma:</span> {book.language}</p>
          <p className="text-gray-500 text-sm">
            <span className="font-semibold">Publicado:</span> {new Date(book.publishedAt).toLocaleDateString()}
          </p>
        </div>
        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Opiniones</h3>
        <form onSubmit={handleAddReview} className="mb-4">
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={3}
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="Escribe tu opinión..."
            disabled={reviewLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={reviewLoading || !reviewText.trim()}
          >
            {reviewLoading ? 'Enviando...' : 'Agregar opinión'}
          </button>
        </form>
        <div className="space-y-4">
          {reviews.length === 0 && <p className="text-gray-400">Sé el primero en opinar sobre este libro.</p>}
          {reviews.map(r => (
            <div key={r._id} className="bg-gray-100 rounded p-3">
              <div className="font-semibold text-blue-700">{r.username}</div>
              <div className="text-gray-700 text-sm mb-1">{new Date(r.createdAt).toLocaleString()}</div>
              <div>{r.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}










