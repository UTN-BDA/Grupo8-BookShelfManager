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

    // MÉTODO MODIFICADO PARA USAR EL SERVICIO TRANSACCIONAL
    async addBookToBookshelfOrCreate(req: Request, res: Response): Promise<void> {
        try {
            const { bookshelfId, userId, status, notes, book } = req.body;
            
            if (book.publishedAt && typeof book.publishedAt === 'string') {
                book.publishedAt = new Date(book.publishedAt);
            }

            const result = await bookService.findOrCreateAndAddToBookshelf(
                book,
                bookshelfId,
                userId,
                status,
                notes
            );

            res.status(201).json(result);
        } catch (error) {
            ErrorResponse.handleError(res, error);
        }
    }
}

export default new BookController();
