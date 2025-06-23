import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { bookService } from '../services/bookService';
import type { Book } from '../services/bookService';
import { useBookCover, useBookReviews } from '../hooks/useBookExtras';
import { useAuth } from '../context/AuthContext';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cover, loading: coverLoading, uploadCover } = useBookCover(id!);
  const { reviews, loading: reviewsLoading, addReview } = useBookReviews(id!);
  const [reviewText, setReviewText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

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

  const isOwner = currentUser && book && currentUser.id === book.createdBy;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCoverFile(file || null);
  };

  const handleCoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await uploadCover(reader.result as string);
        setUploadError(null);
        setCoverFile(null);
      } catch {
        setUploadError('Error subiendo la portada');
      }
    };
    reader.readAsDataURL(coverFile);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    try {
      await addReview(reviewText);
      setReviewText('');
      setReviewError(null);
    } catch {
      setReviewError('Error agregando la opinión');
    }
  };

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
      {/* Portada */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8 mt-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-700">Portada</h3>
        {(() => {
          if (coverLoading) return <p className="text-gray-400">Cargando portada...</p>;
          if (cover) return <img src={cover} alt="Portada del libro" className="w-48 h-64 object-cover rounded shadow mb-2" />;
          return <p className="text-gray-400">Sin portada</p>;
        })()}
        {isOwner && (
          <form className="mt-2 flex flex-col gap-2 items-start" onSubmit={handleCoverSubmit}>
            <label htmlFor="cover-upload-detail" className="block font-medium text-gray-700">Selecciona una imagen:</label>
            <input id="cover-upload-detail" type="file" accept="image/*" onChange={handleCoverChange} className="mb-2" />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-1"
              disabled={coverLoading || !coverFile}
            >
              Agregar portada
            </button>
            {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
          </form>
        )}
      </div>
      {/* Opiniones */}
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8 mt-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">Opiniones</h3>
        {(() => {
          if (reviewsLoading) return <p className="text-gray-400">Cargando opiniones...</p>;
          if (reviews.length === 0) return <p className="text-gray-400">Aún no hay opiniones para este libro.</p>;
          return (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li key={r._id} className="border-b pb-2">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-blue-600 mr-2">{r.username}</span>
                    <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700">{r.content}</p>
                </li>
              ))}
            </ul>
          );
        })()}
        {currentUser && (
          <form className="mt-4" onSubmit={handleAddReview}>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={3}
              placeholder="Escribe tu opinión..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={!reviewText.trim()}
            >
              Agregar opinión
            </button>
            {reviewError && <p className="text-red-500 text-sm mt-1">{reviewError}</p>}
          </form>
        )}
      </div>
    </div>
  );
}










