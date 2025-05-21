import { useState } from 'react';

interface Bookshelf {
  id: string;
  name: string;
  description?: string;
  books: Array<{ id: string; title: string }>;
}

// Obtiene las bibliotecas desde el backend (ejemplo de integración real)
// Aquí deberías usar un servicio real cuando esté disponible
const initialBookshelves: Bookshelf[] = [];

export default function BookshelfPage() {
  const [bookshelves, setBookshelves] = useState<Bookshelf[]>(initialBookshelves);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setBookshelves([
      ...bookshelves,
      {
        id: crypto.randomUUID(),
        name,
        description,
        books: [],
      },
    ]);
    setName('');
    setDescription('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 tracking-tight">Mis Bibliotecas</h1>
        <form onSubmit={handleCreate} className="mb-8 space-y-4">
          <div>
            <label htmlFor="bookshelf-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              id="bookshelf-name"
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="bookshelf-description" className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
            <textarea
              id="bookshelf-description"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition"
          >
            Crear biblioteca
          </button>
        </form>
        <div>
          {bookshelves.length === 0 ? (
            <p className="text-gray-400 text-center">Aún no tienes bibliotecas creadas.</p>
          ) : (
            <ul className="space-y-4">
              {bookshelves.map(bs => (
                <li key={bs.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h2 className="text-lg font-bold text-blue-800">{bs.name}</h2>
                  {bs.description && <p className="text-gray-600 text-sm mb-2">{bs.description}</p>}
                  <p className="text-gray-500 text-xs">Libros guardados: {bs.books.length}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
