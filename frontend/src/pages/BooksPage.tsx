import { useBooks } from '../hooks/useBooks';
import { useNavigate } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import Loader from '../components/Loader';
import { useState } from 'react';

export default function BooksPage() {
  const { books, loading, error } = useBooks();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState('');
  // Filtros
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Obtener autores e idiomas únicos
  const authors = Array.from(new Set(books.map(b => b.author)));
  const languages = Array.from(new Set(books.map(b => b.language)));

  // Lógica de filtrado mejorada
  const filteredBooks = books.filter(book => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.isbn.toLowerCase().includes(q);
    const matchesAuthor = selectedAuthor ? book.author === selectedAuthor : true;
    const matchesLanguage = selectedLanguage ? book.language === selectedLanguage : true;
    return matchesSearch && matchesAuthor && matchesLanguage;
  });

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
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') setSearch(searchValue);
                }}
                aria-label="Buscar libros"
              />
            </div>
            <button className="btn-primary whitespace-nowrap" onClick={() => setSearch(searchValue)}>
              Buscar
            </button>
            <button className="btn-outline whitespace-nowrap" onClick={() => setShowFilters(v => !v)}>
              Filtros
            </button>
          </div>
          {/* Filtros desplegables */}
          {showFilters && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <label className="block text-sm mb-1" htmlFor="filter-author-autocomplete">Autor</label>
                <input
                  className="input"
                  id="filter-author-autocomplete"
                  type="text"
                  placeholder="Escribe un autor..."
                  value={selectedAuthor}
                  onChange={e => setSelectedAuthor(e.target.value)}
                  autoComplete="off"
                />
                {/* Sugerencias de autores */}
                {selectedAuthor && authors.filter(a => a.toLowerCase().includes(selectedAuthor.toLowerCase()) && a !== selectedAuthor).length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-200 rounded w-full mt-1 max-h-40 overflow-y-auto shadow-lg">
                    {authors
                      .filter(a => a.toLowerCase().includes(selectedAuthor.toLowerCase()) && a !== selectedAuthor)
                      .slice(0, 10)
                      .map(author => (
                        <li key={author} className="px-0 py-0">
                          <button
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => setSelectedAuthor(author)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                setSelectedAuthor(author);
                              }
                            }}
                          >
                            {author}
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="filter-language">Idioma</label>
                <select
                  className="input"
                  id="filter-language"
                  value={selectedLanguage}
                  onChange={e => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Todos</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  className="btn-outline"
                  onClick={() => {
                    setSelectedAuthor('');
                    setSelectedLanguage('');
                  }}
                  type="button"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
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
        {filteredBooks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <button
                key={book.id}
                type="button"
                onClick={() => navigate(`/books/${book.id}`)}
                style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, textAlign: 'inherit' }}
                aria-label={`Ver detalles del libro ${book.title}`}
                className="text-left w-full"
              >
                <BookCard book={book} />
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredBooks.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="heading-3 text-text-light mb-2">
              No hay libros disponibles
            </h3>
            <p className="text-text-lighter mb-6">
              Parece que aún no hay libros en la biblioteca.
            </p>
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