import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { ErrorResponse } from '../../utils';
import { CreateBookParams, UpdateBookParams } from '../types/book.types';

const bookService = new BookService();

export class BookController {
    async createBook(req: Request, res: Response): Promise<void> {
        try {
        const params: CreateBookParams = req.body;
        if (params.publishedAt && typeof params.publishedAt === 'string') {
          if (/^\d{4}-\d{2}-\d{2}$/.test(params.publishedAt)) {
            params.publishedAt = new Date(params.publishedAt + 'T00:00:00Z');
          } else {
            params.publishedAt = new Date(params.publishedAt);
          }
        }
        const book = await bookService.createBook(params);
        res.status(201).json(book);
        } catch (error) {
        ErrorResponse.handleError(res, error);
        }
    }
    
    async updateBook(req: Request, res: Response): Promise<void> {
        try {
        const params: UpdateBookParams = req.body;
        const bookId = req.params.id;
        const updatedBook = await bookService.updateBook(bookId, params);
        res.status(200).json(updatedBook);
        } catch (error) {
        ErrorResponse.handleError(res, error);
        }
    }
    
    async deleteBook(req: Request, res: Response): Promise<void> {
        try {
        const bookId = req.params.id;
        await bookService.deleteBook(bookId);
        res.status(204).send();
        } catch (error) {
        ErrorResponse.handleError(res, error);
        }
    }

    async getAllBooks(req: Request, res: Response): Promise<void> {
        try {
        const books = await bookService.getAllBooks();
        res.status(200).json(books);
        } catch (error) {
        ErrorResponse.handleError(res, error);
        }
    }

    async getBookById(req: Request, res: Response): Promise<void> {
        try {
        const bookId = req.params.id;
        const book = await bookService.getBookById(bookId);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json(book);
        } catch (error) {
        ErrorResponse.handleError(res, error);
        }
    }

    async addBookToBookshelfOrCreate(req: Request, res: Response): Promise<void> {
        try {
            const { bookshelfId, userId, status, notes, book } = req.body;
            // Convertir publishedAt a Date si es string
            if (book.publishedAt && typeof book.publishedAt === 'string') {
                book.publishedAt = new Date(book.publishedAt);
            }
            // Buscar libro por ISBN
            let foundBook = await bookService.findBookByISBN(book.isbn);
            foundBook ??= await bookService.createBook(book);
            // Asociar a la estantería
            const bookshelfBook = await (await import('../../api-bookshelf/services/bookshelf.service')).addBookToBookshelf({
                bookshelfId,
                bookId: foundBook.id,
                userId,
                status,
                notes
            });
            res.status(201).json({ book: foundBook, bookshelfBook });
        } catch (error) {
            ErrorResponse.handleError(res, error);
        }
    }

    async addUserBook(req: Request, res: Response): Promise<void> {
        try {
            const { userId, title, author, isbn, pages, publisher, language, publishedAt, notes } = req.body;
            const { createUserBook } = await import('../services/userbook.service');
            const userBook = await createUserBook({
                userId,
                title,
                author,
                isbn,
                pages,
                publisher,
                language,
                publishedAt: new Date(publishedAt),
                notes
            });
            res.status(201).json(userBook);
        } catch (error) {
            ErrorResponse.handleError(res, error);
        }
    }

}

export default new BookController();