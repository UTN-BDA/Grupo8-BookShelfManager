import { useBooks } from '../hooks/useBooks';
import { useNavigate } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import Loader from '../components/Loader';

export default function BooksPage() {
  const { books, loading, error } = useBooks();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary py-8">
      <div className="container-main">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="heading-1 text-primary-800">
            📚 Biblioteca Digital
          </h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            Descubre y explora nuestra colección de libros
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <input 
                type="text" 
                className="input" 
                placeholder="🔍 Buscar libros por título, autor o ISBN..."
              />
            </div>
            <button className="btn-primary whitespace-nowrap">
              Buscar
            </button>
            <button className="btn-outline whitespace-nowrap">
              Filtros
            </button>
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}
        
        {error && (
          <div className="bg-accent-50 border-l-4 border-accent p-6 rounded-lg mb-8">
            <div className="flex items-center">
              <span className="text-accent mr-2 text-xl">⚠️</span>
              <p className="text-accent-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {books.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
              <div key={book.id} onClick={() => navigate(`/books/${book.id}`)}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {books.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="heading-3 text-text-light mb-2">
              No hay libros disponibles
            </h3>
            <p className="text-text-lighter mb-6">
              Parece que aún no hay libros en la biblioteca.
            </p>
            <button className="btn-primary">
              Agregar Primer Libro
            </button>
          </div>
        )}

        {/* Stats Section */}
        {books.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl text-primary mb-2">📚</div>
              <div className="text-2xl font-bold text-text">{books.length}</div>
              <div className="text-text-light">Libros Totales</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl text-accent mb-2">👨‍💼</div>
              <div className="text-2xl font-bold text-text">
                {new Set(books.map(book => book.author)).size}
              </div>
              <div className="text-text-light">Autores Únicos</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl text-sky mb-2">🌍</div>
              <div className="text-2xl font-bold text-text">
                {new Set(books.map(book => book.language)).size}
              </div>
              <div className="text-text-light">Idiomas</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}