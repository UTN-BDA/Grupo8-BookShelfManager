import type { Book } from '../services/bookService';

interface BookCardProps {
  readonly book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="card group cursor-pointer transform transition-all duration-200 hover:-translate-y-1">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-text group-hover:text-primary transition-colors duration-200 line-clamp-2">
            📖 {book.title}
          </h2>
        </div>
        
        <div className="space-y-2">
          <p className="text-text-light font-medium">
            <span className="text-primary font-semibold">👨‍💼 Autor:</span> {book.author}
          </p>
          <p className="text-text-lighter text-sm">
            <span className="text-primary font-semibold">📚 ISBN:</span> {book.isbn}
          </p>
          <p className="text-text-lighter text-sm">
            <span className="text-primary font-semibold">🏢 Editorial:</span> {book.publisher}
          </p>
          <p className="text-text-lighter text-sm">
            <span className="text-primary font-semibold">🌍 Idioma:</span> {book.language}
          </p>
        </div>
        
        <div className="pt-2 border-t border-neutral-300">
          <p className="text-text-lighter text-xs flex items-center">
            <span className="text-sky-600 mr-1">📅</span>
            Publicado: {new Date(book.publishedAt).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
}
