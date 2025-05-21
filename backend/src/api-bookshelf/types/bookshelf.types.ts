export interface CreateBookshelfDto {
  userId: string;
  name: string;
  description: string;
}

export interface AddBookToBookshelfDto {
  bookshelfId: string;
  bookId: string;
  userId: string;
  status: string;
  notes?: string;
}

export interface UpdateBookshelfBookDto {
  bookshelfId: string;
  bookId: string;
  status: string;
  notes?: string;
}
