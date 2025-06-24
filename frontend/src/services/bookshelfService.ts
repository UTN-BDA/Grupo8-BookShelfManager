import api from './api';

export interface Bookshelf {
  id: string;
  name: string;
  description?: string;
  books: Array<{
    id: string;
    title: string;
    author?: string;
    isbn?: string;
    pages?: number;
    publisher?: string;
    language?: string;
    publishedAt?: string;
    createdBy?: string;
  }>;
}

export interface CreateBookshelfDto {
  userId: string;
  name: string;
  description?: string;
}

export interface AddBookToBookshelfDto {
  bookshelfId: string;
  bookId: string;
  userId: string;
  status: string;
  notes?: string;
}

export const bookshelfService = {
  async getBookshelfsByUser(userId: string): Promise<Bookshelf[]> {
    const res = await api.get<Bookshelf[]>(`/bookshelfs/user/${userId}`);
    return res.data;
  },

  async createBookshelf(data: CreateBookshelfDto): Promise<Bookshelf> {
    const res = await api.post<Bookshelf>('/bookshelfs', data);
    return res.data;
  },

  async addBookToBookshelf(data: AddBookToBookshelfDto) {
    const res = await api.post(`/bookshelfs/${data.bookshelfId}/books`, data);
    return res.data;
  },

  async addOrCreateBookToBookshelf(payload: {
    bookshelfId: string;
    userId: string;
    status: string;
    notes?: string;
    book: Omit<import('./bookService').Book, 'id'>;
  }) {
    const res = await api.post('/books/add-to-bookshelf', payload);
    return res.data;
  },

  async getBookshelfById(id: string): Promise<Bookshelf> {
    const res = await api.get<Bookshelf>(`/bookshelfs/${id}`);
    return res.data;
  },

  async removeBookFromBookshelf({ bookshelfId, bookId, userId }: { bookshelfId: string; bookId: string; userId: string }) {
    return api.delete(`/bookshelfs/${bookshelfId}/books/${bookId}`, { data: { userId } });
  },
};
