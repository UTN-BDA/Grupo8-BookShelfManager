import { useState } from 'react';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';

export default function AddOwnBookForm({ onBookAdded }: { onBookAdded?: () => void }) {
  useAuth();
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    pages: '',
    publisher: '',
    language: '',
    publishedAt: '',
    status: 'pendiente',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await bookService.createBook({
        title: form.title,
        author: form.author,
        isbn: form.isbn,
        pages: Number(form.pages),
        publisher: form.publisher,
        language: form.language,
        publishedAt: form.publishedAt
      });
      setMsg('¡Libro agregado correctamente!');
      setForm({
        title: '',
        author: '',
        isbn: '',
        pages: '',
        publisher: '',
        language: '',
        publishedAt: '',
        status: 'pendiente',
        notes: ''
      });
      if (onBookAdded) onBookAdded();
    } catch {
      setMsg('Error al agregar el libro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-gray-800 p-4 rounded">
      <h3 className="text-lg font-bold text-white">Subir libro propio</h3>
      <input name="title" placeholder="Título" value={form.title} onChange={handleChange} required className="w-full p-2 rounded" />
      <input name="author" placeholder="Autor" value={form.author} onChange={handleChange} required className="w-full p-2 rounded" />
      <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required className="w-full p-2 rounded" />
      <input name="pages" placeholder="Páginas" value={form.pages} onChange={handleChange} type="number" required className="w-full p-2 rounded" />
      <input name="publisher" placeholder="Editorial" value={form.publisher} onChange={handleChange} required className="w-full p-2 rounded" />
      <input name="language" placeholder="Idioma" value={form.language} onChange={handleChange} required className="w-full p-2 rounded" />
      <input name="publishedAt" placeholder="Fecha publicación (YYYY-MM-DD)" value={form.publishedAt} onChange={handleChange} type="date" required className="w-full p-2 rounded" />
      <input name="notes" placeholder="Notas (opcional)" value={form.notes} onChange={handleChange} className="w-full p-2 rounded" />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Agregando...' : 'Subir libro propio'}
      </button>
      {msg && <div className="text-white">{msg}</div>}
    </form>
  );
}
