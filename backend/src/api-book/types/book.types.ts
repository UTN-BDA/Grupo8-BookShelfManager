export type Book = {
  id: string;
  title: string;
  author: string;
  isbn: string;
  pages: number;
  publisher: string;
  language: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBookParams = {
  title: string;
  author: string;
  isbn: string;
  pages: number;
  publisher: string;
  language: string;
  publishedAt: Date;
};

export type UpdateBookParams = Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>;