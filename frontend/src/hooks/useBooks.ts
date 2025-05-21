import { useEffect, useState } from 'react';
import type { Book } from '../services/bookService';
import { bookService } from '../services/bookService';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bookService.getBooks()
      .then(setBooks)
      .catch(() => setError('Error al cargar los libros'))
      .finally(() => setLoading(false));
  }, []);

  return { books, loading, error };
}
