import api from './api';

export interface Bookshelf {
  id: string;
  name: string;
  description?: string;
  books: Array<{ id: string; title: string }>;
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
};
