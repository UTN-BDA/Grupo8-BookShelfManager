import { useState, useEffect } from 'react';
import { bookshelfService, type Bookshelf } from '../services/bookshelfService';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../hooks/useBooks';
import AddOwnBookForm from '../components/AddOwnBookForm';
import { useNavigate } from 'react-router-dom';

export default function BookshelfPage() {
  const { currentUser } = useAuth();
  const [bookshelfs, setBookshelfs] = useState<Bookshelf[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { books: allBooks } = useBooks();
  const [showAddBookModal, setShowAddBookModal] = useState<string | null>(null); // bookshelfId
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [addBookError, setAddBookError] = useState<string | null>(null);
  const [addBookLoading, setAddBookLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    bookshelfService.getBookshelfsByUser(currentUser.id)
      .then(setBookshelfs)
      .catch(() => setFetchError('No se pudieron cargar las bibliotecas.'))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!currentUser) {
      setError('Debes iniciar sesión para crear una biblioteca');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const newBs = await bookshelfService.createBookshelf({
        userId: currentUser.id,
        name,
        description,
      });
      setBookshelfs((prev) => [...prev, newBs]);
      setName('');
      setDescription('');
      navigate(`/bookshelf/${newBs.id}`);
    } catch {
      setError('No se pudo crear la biblioteca.');
    } finally {
      setLoading(false);
    }
  };


  const handleBookAdded = async () => {
    if (!currentUser) return;
    // Refresca las estanterías para actualizar el contador
    const updated = await bookshelfService.getBookshelfsByUser(currentUser.id);
    setBookshelfs(updated);
  };

  const handleAddBookToShelf = async (bookshelfId: string) => {
    if (!selectedBookId) {
      setAddBookError('Selecciona un libro');
      return;
    }
    if (!currentUser) {
      setAddBookError('Debes iniciar sesión');
      return;
    }
    
    setAddBookLoading(true);
    setAddBookError(null);
    
    try {
      await bookshelfService.addBookToBookshelf({
        bookshelfId,
        bookId: selectedBookId,
        userId: currentUser.id,
        status: 'pendiente',
        notes: '',
      });
      
      const updated = await bookshelfService.getBookshelfsByUser(currentUser.id);
      setBookshelfs(updated);
      setShowAddBookModal(null);
      setSelectedBookId('');
      setSuccessMessage('Libro agregado correctamente a la biblioteca.');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch {
      setAddBookError('No se pudo agregar el libro');
    } finally {
      setAddBookLoading(false);
    }
  };

  const getFilteredBooks = (bookshelf: Bookshelf) => {
    return allBooks.filter(book => 
      !bookshelf.books.some(shelfBook => shelfBook.id === book.id)
    );
  };

  const renderBookshelfItem = (bookshelf: Bookshelf) => {
    const filteredGlobalBooks = getFilteredBooks(bookshelf);
    
    return (
      <li key={bookshelf.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-blue-800">{bookshelf.name}</h2>
          {bookshelf.description && <p className="text-gray-600 text-sm mb-2">{bookshelf.description}</p>}
          <p className="text-gray-500 text-xs mb-2">Libros guardados: {bookshelf.books.length}</p>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold shadow"
            onClick={() => {
              setShowAddBookModal(bookshelf.id);
              setSelectedBookId('');
              setAddBookError(null);
            }}
          >
            + Agregar libro existente
          </button>
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900 text-sm self-end sm:self-auto"
            onClick={() => navigate(`/bookshelf/${bookshelf.id}`)}
          >
            Ver biblioteca completa
          </button>
        </div>
        {/* Modal para agregar libro existente a esta biblioteca */}
        {showAddBookModal === bookshelf.id && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => { setShowAddBookModal(null); setSelectedBookId(''); setAddBookError(null); }}
                aria-label="Cerrar"
              >
                ×
              </button>
              <h3 className="text-lg font-bold mb-4">Agregar libro existente a esta biblioteca</h3>
              <select
                className="w-full mb-4 border rounded p-2"
                value={selectedBookId}
                onChange={e => setSelectedBookId(e.target.value)}
                disabled={addBookLoading}
              >
                <option value="">Selecciona un libro</option>
                {filteredGlobalBooks.map(book => (
                  <option key={book.id} value={book.id}>{book.title}</option>
                ))}
              </select>
              {addBookError && <p className="text-red-500 text-sm mb-2">{addBookError}</p>}
              <button
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition"
                onClick={() => handleAddBookToShelf(bookshelf.id)}
                disabled={addBookLoading}
              >
                {addBookLoading ? 'Agregando...' : 'Agregar libro'}
              </button>
            </div>
          </div>
        )}
      </li>
    );
  };

  const renderBookshelfContent = () => {
    if (loading && bookshelfs.length === 0) {
      return <p className="text-gray-400 text-center">Cargando bibliotecas...</p>;
    }
    
    if (fetchError) {
      return <p className="text-red-500 text-center">{fetchError}</p>;
    }
    
    if (bookshelfs.length === 0) {
      return <p className="text-gray-400 text-center">Aún no tienes bibliotecas creadas.</p>;
    }
    
    return (
      <ul className="space-y-4">
        {bookshelfs.map(renderBookshelfItem)}
      </ul>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4" style={{ backgroundColor: '#FFECCC' }}>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 tracking-tight">Mis Bibliotecas</h1>
        <form onSubmit={handleCreate} className="mb-8 space-y-4">
          <div>
            <label htmlFor="bookshelf-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              id="bookshelf-name"
              type="text"
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="bookshelf-description" className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
            <textarea
              id="bookshelf-description"
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear biblioteca'}
          </button>
        </form>
        <div className="flex justify-center mb-4 gap-1 sm:gap-2">
          
          <button
            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 text-sm"
            onClick={() => setShowAddBookModal('own')}
          >
            + Subir libro propio
          </button>
        </div>
        {renderBookshelfContent()}

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
            {successMessage}
          </div>
        )}

        {/* Modal para subir libro propio */}
        {showAddBookModal === 'own' && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowAddBookModal(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
              {/* Por defecto, se asocia a la primera estantería del usuario */}
              <AddOwnBookForm onBookAdded={handleBookAdded} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
