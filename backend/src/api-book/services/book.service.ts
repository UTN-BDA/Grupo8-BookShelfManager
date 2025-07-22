import { prisma } from "../../config";
import { CreateBookParams, UpdateBookParams, Book } from "../types/book.types";

export class BookService {
  async createBook(params: CreateBookParams): Promise<Book> {
    const book = await prisma.book.create({
      data: {
        ...params,
        createdBy: params.createdBy ?? null,
      },
    });
    return book;
  }

  async updateBook(id: string, params: UpdateBookParams): Promise<Book | null> {
    const book = await prisma.book.update({
      where: { id },
      data: params,
    });
    return book;
  }

  async deleteBook(id: string): Promise<Book | null> {
    const book = await prisma.book.delete({
      where: { id },
    });
    return book;
  }

  async getAllBooks(): Promise<Book[]> {
    const books = await prisma.book.findMany();
    return books;
  }

  async getBookById(id: string): Promise<Book | null> {
    const book = await prisma.book.findUnique({
      where: { id },
    });
    return book;
  }

  async findBookByISBN(isbn: string): Promise<Book | null> {
    return prisma.book.findUnique({ where: { isbn } });
  }

  // MÉTODO NUEVO AGREGADO CON LÓGICA TRANSACCIONAL
  async findOrCreateAndAddToBookshelf(
    bookData: CreateBookParams,
    bookshelfId: string,
    userId: string,
    status: string,
    notes: string | undefined
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. Buscar libro por ISBN dentro de la transacción
      let book = await tx.book.findUnique({
        where: { isbn: bookData.isbn },
      });

      // 2. Si no existe, crearlo dentro de la misma transacción
      book ??= await tx.book.create({
          data: {
            ...bookData,
            createdBy: bookData.createdBy ?? null,
          },
        });

      // 3. Asociar el libro a la estantería en la misma transacción
      const bookshelfBook = await tx.bookshelfBook.create({
        data: {
          bookshelfId,
          bookId: book.id,
          userId,
          status,
          notes,
        },
      });

      return { book, bookshelfBook };
    });
  }
}

export default new BookService();
