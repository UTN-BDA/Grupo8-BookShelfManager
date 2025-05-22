import { prisma } from '../../config/prisma';
import { CreateBookshelfDto, AddBookToBookshelfDto, UpdateBookshelfBookDto } from '../types/bookshelf.types';

export const createBookshelf = async ({ userId, name, description }: CreateBookshelfDto) => {
  return prisma.bookshelf.create({
    data: { userId, name, description },
  });
};

export const getBookshelfsByUser = async (userId: string) => {
  return prisma.bookshelf.findMany({
    where: { userId },
    include: { books: { include: { book: true } } },
  });
};

export const getBookshelfById = async (id: string) => {
  return prisma.bookshelf.findUnique({
    where: { id },
    include: { books: { include: { book: true } } },
  });
};

export const updateBookshelf = async (id: string, { name, description }: { name: string; description: string }) => {
  return prisma.bookshelf.update({
    where: { id },
    data: { name, description },
  });
};

export const deleteBookshelf = async (id: string) => {
  // Elimina primero los BookshelfBook relacionados
  await prisma.bookshelfBook.deleteMany({ where: { bookshelfId: id } });
  return prisma.bookshelf.delete({ where: { id } });
};

export const addBookToBookshelf = async ({ bookshelfId, bookId, userId, status, notes }: AddBookToBookshelfDto) => {
  return prisma.bookshelfBook.create({
    data: { bookshelfId, bookId, userId, status, notes },
  });
};

export const updateBookshelfBook = async ({ bookshelfId, bookId, userId, status, notes }: UpdateBookshelfBookDto & { userId: string }) => {
  return prisma.bookshelfBook.update({
    where: {
      bookshelfId_bookId_userId: {
        bookshelfId,
        bookId,
        userId,
      },
    },
    data: { status, notes },
  });
};

export const removeBookFromBookshelf = async ({ bookshelfId, bookId, userId }: { bookshelfId: string, bookId: string, userId: string }) => {
  return prisma.bookshelfBook.delete({
    where: {
      bookshelfId_bookId_userId: {
        bookshelfId,
        bookId,
        userId,
      },
    },
  });
};
