import { useState } from 'react';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { uploadBookCover } from '../services/bookExtraService';

export default function AddOwnBookForm({ onBookAdded }: Readonly<{ onBookAdded?: () => void }>) {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    pages: '',
    publisher: '',
    language: '',
    publishedAt: '',
    status: 'pendiente'
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setCoverError(null);
    try {
      const newBook = await bookService.createBook({
        title: form.title,
        author: form.author,
        isbn: form.isbn,
        pages: Number(form.pages),
        publisher: form.publisher,
        language: form.language,
        publishedAt: form.publishedAt,
        createdBy: currentUser!.id // Forzar que siempre haya usuario
      });
      // Si hay portada, subirla
      if (coverFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            await uploadBookCover(newBook.id, reader.result as string);
            setMsg('¡Libro y portada agregados correctamente!');
          } catch {
            setMsg('Libro agregado, pero error al subir la portada');
            setCoverError('Error al subir la portada');
          }
          setCoverFile(null);
        };
        reader.readAsDataURL(coverFile);
      } else {
        setMsg('¡Libro agregado correctamente!');
      }
      setForm({
        title: '',
        author: '',
        isbn: '',
        pages: '',
        publisher: '',
        language: '',
        publishedAt: '',
        status: 'pendiente'
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
      <label htmlFor="cover-upload" className="block text-white font-medium mt-2">Portada (opcional):</label>
      <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverChange} className="w-full p-2 rounded bg-white" />
      {coverError && <div className="text-red-400 text-sm">{coverError}</div>}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Agregando...' : 'Subir libro propio'}
      </button>
      {msg && <div className="text-white">{msg}</div>}
    </form>
  );
}
