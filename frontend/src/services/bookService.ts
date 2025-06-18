import api from './api';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  pages: number;
  publisher: string;
  language: string;
  publishedAt: string;
}

export const bookService = {
  async getBooks(): Promise<Book[]> {
    const res = await api.get<Book[]>('/books');
    return res.data;
  },
  async getBookById(id: string): Promise<Book> {
    const res = await api.get<Book>(`/books/${id}`);
    return res.data;
  },
  async createBook(book: Omit<Book, 'id'>): Promise<Book> {
    const res = await api.post<Book>('/books', book);
    return res.data;
  },
};
