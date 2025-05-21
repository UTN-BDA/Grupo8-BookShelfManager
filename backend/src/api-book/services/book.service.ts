import { prisma } from '../../config';
import { CreateBookParams, UpdateBookParams, Book } from '../types/book.types';

export class BookService {
    async createBook(params: CreateBookParams): Promise<Book> {
        const book = await prisma.book.create({
        data: params,
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
}

export default new BookService();