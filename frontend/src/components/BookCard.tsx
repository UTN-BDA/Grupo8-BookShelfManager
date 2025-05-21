import type { Book } from '../services/bookService';

interface BookCardProps {
  readonly book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-2 border hover:shadow-lg transition">
      <h2 className="text-lg font-bold">{book.title}</h2>
      <p className="text-gray-700">Autor: {book.author}</p>
      <p className="text-gray-500 text-sm">ISBN: {book.isbn}</p>
      <p className="text-gray-500 text-sm">Editorial: {book.publisher}</p>
      <p className="text-gray-500 text-sm">Idioma: {book.language}</p>
      <p className="text-gray-400 text-xs">Publicado: {new Date(book.publishedAt).toLocaleDateString()}</p>
    </div>
  );
}
