import { Request, Response } from 'express';
import * as bookshelfService from '../services/bookshelf.service';

export const createBookshelf = async (req: Request, res: Response) => {
  try {
    const { userId, name, description } = req.body;
    const bookshelf = await bookshelfService.createBookshelf({ userId, name, description });
    res.status(201).json(bookshelf);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const getBookshelvesByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookshelves = await bookshelfService.getBookshelvesByUser(userId);
    res.json(bookshelves);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const getBookshelfById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookshelf = await bookshelfService.getBookshelfById(id);
    res.json(bookshelf);
  } catch (error) {
    const err = error as Error;
    res.status(404).json({ error: err.message });
  }
};

export const updateBookshelf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const bookshelf = await bookshelfService.updateBookshelf(id, { name, description });
    res.json(bookshelf);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const deleteBookshelf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await bookshelfService.deleteBookshelf(id);
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const addBookToBookshelf = async (req: Request, res: Response) => {
  try {
    const { bookshelfId } = req.params;
    const { bookId, userId, status, notes } = req.body;
    const bookshelfBook = await bookshelfService.addBookToBookshelf({ bookshelfId, bookId, userId, status, notes });
    res.status(201).json(bookshelfBook);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const updateBookshelfBook = async (req: Request, res: Response) => {
  try {
    const { bookshelfId, bookId } = req.params;
    const { userId, status, notes } = req.body;
    const bookshelfBook = await bookshelfService.updateBookshelfBook({ bookshelfId, bookId, userId, status, notes });
    res.json(bookshelfBook);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const removeBookFromBookshelf = async (req: Request, res: Response) => {
  try {
    const { bookshelfId, bookId } = req.params;
    const { userId } = req.body;
    await bookshelfService.removeBookFromBookshelf({ bookshelfId, bookId, userId });
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};
