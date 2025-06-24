import type { Book } from '../services/bookService';

interface BookCardProps {
  readonly book: Book;
  onClick?: () => void;
  onDelete?: () => void;
  deletable?: boolean;
}

export function BookCard({ book, onClick, onDelete, deletable }: Readonly<BookCardProps>) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  const cardContent = (
    <div className="flex flex-col gap-3 group">
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
      <div className="pt-2 border-t border-neutral-300 flex items-center justify-between">
        <p className="text-text-lighter text-xs flex items-center">
          <span className="text-sky-600 mr-1">📅</span>
          Publicado: {book.publishedAt ? new Date(book.publishedAt).toLocaleDateString('es-ES') : 'Sin fecha'}
        </p>
        {deletable && onDelete && (
          <button
            type="button"
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 border border-red-300 text-red-700 w-8 h-8 flex items-center justify-center shadow hover:bg-red-200 focus:ring-2 focus:ring-red-400 z-10 rounded"
            title="Eliminar libro de la biblioteca"
            onClick={handleDelete}
            style={{ minWidth: 32, minHeight: 32 }}
          >
            <span aria-label="Eliminar" className="text-lg">🗑️</span>
          </button>
        )}
      </div>
    </div>
  );

  const classes =
    'card text-left w-full group transform transition-all duration-200 hover:-translate-y-1' +
    (onClick ? ' cursor-pointer' : '');

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        aria-label={`Ver detalles de ${book.title}`}
        style={{ background: 'none', border: 'none', padding: 0, textAlign: 'inherit' }}
      >
        {cardContent}
      </button>
    );
  }

  return <div className={classes}>{cardContent}</div>;
}
