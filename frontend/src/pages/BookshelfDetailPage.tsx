import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { bookshelfService, type Bookshelf } from '../services/bookshelfService';
import { useEffect, useState, useRef } from 'react';
import { BookCard } from '../components/BookCard';
import { useAuth } from '../context/AuthContext';

export default function BookshelfDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books: allBooks } = useBooks();
  const { currentUser } = useAuth();
  const [bookshelf, setBookshelf] = useState<Bookshelf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGlobalBookModal, setShowGlobalBookModal] = useState(false);
  const [globalBookId, setGlobalBookId] = useState('');
  const [globalBookError, setGlobalBookError] = useState<string | null>(null);
  const [globalBookLoading, setGlobalBookLoading] = useState(false);
  const [showDeleteBookModal, setShowDeleteBookModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bookshelfService.getBookshelfById(id)
      .then((data) => setBookshelf(data))
      .catch(() => setError('No se pudo cargar la biblioteca.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Filtrar libros globales que NO están en la biblioteca
  const filteredGlobalBooks = allBooks.filter(
    b => !bookshelf?.books.some(book => book.id === b.id)
  );

  // Handler igual que en BookshelfPage
  const handleAddGlobalBook = async () => {
    if (!globalBookId) {
      setGlobalBookError('Selecciona un libro');
      return;
    }
    setGlobalBookLoading(true);
    setGlobalBookError(null);
    try {
      // Obtener userId del contexto de usuario
      const userId = currentUser?.id ?? localStorage.getItem('userId') ?? '';
      await bookshelfService.addBookToBookshelf({
        bookshelfId: bookshelf!.id,
        bookId: globalBookId,
        userId,
        status: 'pendiente',
        notes: '',
      });
      // Refrescar la biblioteca
      const updated = await bookshelfService.getBookshelfById(bookshelf!.id);
      setBookshelf(updated);
      setShowGlobalBookModal(false);
      setGlobalBookId('');
    } catch {
      setGlobalBookError('No se pudo agregar el libro');
    } finally {
      setGlobalBookLoading(false);
    }
  };

  // Handler para abrir modal de confirmación
  const openDeleteModal = (bookId: string) => {
    setBookToDelete(bookId);
    setShowDeleteBookModal(true);
  };

  // Handler para eliminar libro de la biblioteca (solo si se confirma)
  const handleRemoveBook = async () => {
    if (!bookshelf || !bookToDelete) return;
    setDeleteLoading(true);
    const userId = currentUser?.id ?? localStorage.getItem('userId') ?? '';
    try {
      await bookshelfService.removeBookFromBookshelf({
        bookshelfId: bookshelf.id,
        bookId: bookToDelete,
        userId,
      });
      // Refrescar la biblioteca
      const updated = await bookshelfService.getBookshelfById(bookshelf.id);
      setBookshelf(updated);
      setShowDeleteBookModal(false);
      setBookToDelete(null);
    } catch {
      alert('No se pudo eliminar el libro de la biblioteca');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-secondary"><p className="text-gray-500">Cargando biblioteca...</p></div>;
  }
  if (error ?? !bookshelf) {
    return <div className="min-h-screen flex items-center justify-center bg-secondary"><p className="text-red-500">{error ?? 'Biblioteca no encontrada'}</p></div>;
  }

  return (
    <div className="min-h-screen bg-secondary py-8">
      <div className="container-main">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="heading-1 text-primary-800">{bookshelf.name}</h1>
          {bookshelf.description && (
            <p className="text-xl text-text-light max-w-2xl mx-auto">{bookshelf.description}</p>
          )}
        </div>
        {/* Content */}
        {bookshelf.books.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="heading-3 text-text-light mb-2">
              Aún no hay libros en esta biblioteca
            </h3>
            <p className="text-text-lighter mb-6">
              Puedes agregar libros a continuación.
            </p>
            <div className="flex justify-center gap-2">
              <button className="btn-primary" onClick={() => navigate(-1)}>
                ← Volver
              </button>
              <button
                className="btn-primary bg-green-600 hover:bg-green-700"
                onClick={() => setShowGlobalBookModal(true)}
              >
                + Agregar libro
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <button className="text-blue-700 hover:underline text-sm" onClick={() => navigate(-1)}>
                ← Volver
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold shadow"
                onClick={() => setShowGlobalBookModal(true)}
              >
                + Agregar libro existente
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-6">Libros en esta biblioteca:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookshelf.books.map((book) => {
                const fullBook = allBooks.find(b => b.id === book.id);
                return fullBook ? (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => navigate(`/books/${book.id}`)}
                    style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, textAlign: 'inherit' }}
                    aria-label={`Ver detalles del libro ${fullBook.title}`}
                    className="text-left w-full"
                  >
                    <BookCard
                      book={fullBook}
                      onDelete={() => openDeleteModal(book.id)}
                      deletable
                    />
                  </button>
                ) : (
                  <div key={book.id} className="bg-red-100 text-red-700 p-4 rounded">
                    Datos del libro no encontrados.
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {showGlobalBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => { setShowGlobalBookModal(false); setGlobalBookId(''); setGlobalBookError(null); }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4">Agregar libro global a esta biblioteca</h3>
            <select
              className="w-full mb-4 border rounded p-2"
              value={globalBookId}
              onChange={e => setGlobalBookId(e.target.value)}
              disabled={globalBookLoading}
            >
              <option value="">Selecciona un libro</option>
              {filteredGlobalBooks.map(book => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
            {globalBookError && <p className="text-red-500 text-sm mb-2">{globalBookError}</p>}
            <button
              className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition"
              onClick={handleAddGlobalBook}
              disabled={globalBookLoading}
            >
              {globalBookLoading ? 'Agregando...' : 'Agregar libro'}
            </button>
          </div>
        </div>
      )}
      {/* Modal de confirmación para eliminar libro */}
      {showDeleteBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => { setShowDeleteBookModal(false); setBookToDelete(null); }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-red-700">¿Eliminar libro de la biblioteca?</h3>
            <p className="mb-6 text-text-light">Esta acción solo lo quitará de esta biblioteca, no lo eliminará del sistema.</p>
            <div className="flex gap-4">
              <button
                className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 transition"
                onClick={handleRemoveBook}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
              <button
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-300 transition"
                onClick={() => { setShowDeleteBookModal(false); setBookToDelete(null); }}
                disabled={deleteLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}