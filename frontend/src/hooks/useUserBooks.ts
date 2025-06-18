import { useEffect, useState } from 'react';
import { bookshelfService, type Bookshelf } from '../services/bookshelfService';
import { useAuth } from '../context/AuthContext';
import type { Book } from '../services/bookService';

// Extrae los libros reales de la estructura BookshelfBook[]
function extractBooksFromBookshelf(bs: Bookshelf): Book[] {
  return bs.books
    .map((b: any) => b.book)
    .filter((b: Book | undefined) => !!b);
}

export function useUserBooks() {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    bookshelfService.getBookshelfsByUser(currentUser.id)
      .then((bookshelfs: Bookshelf[]) => {
        // Extraer todos los libros de todas las estanterías
        const allBooks = bookshelfs.flatMap(extractBooksFromBookshelf);
        // Eliminar duplicados por id
        const uniqueBooks = Array.from(new Map(allBooks.map(b => [b.id, b])).values());
        setBooks(uniqueBooks);
      })
      .catch(() => setError('No se pudieron cargar los libros del usuario.'))
      .finally(() => setLoading(false));
  }, [currentUser]);

  return { books, loading, error };
}
