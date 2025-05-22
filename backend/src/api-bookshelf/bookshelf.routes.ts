import { Router } from 'express';
import * as bookshelfController from './controller/bookshelf.controller';

const router = Router();

// Crear una nueva biblioteca
router.post('/', bookshelfController.createBookshelf);

// Obtener todas las bibliotecas de un usuario
router.get('/user/:userId', bookshelfController.getBookshelfsByUser);

// Obtener una biblioteca por ID
router.get('/:id', bookshelfController.getBookshelfById);

// Actualizar una biblioteca
router.put('/:id', bookshelfController.updateBookshelf);

// Eliminar una biblioteca
router.delete('/:id', bookshelfController.deleteBookshelf);

// Agregar un libro a una biblioteca
router.post('/:bookshelfId/books', bookshelfController.addBookToBookshelf);

// Actualizar estado y notas de un libro en una biblioteca
router.put('/:bookshelfId/books/:bookId', bookshelfController.updateBookshelfBook);

// Eliminar un libro de una biblioteca
router.delete('/:bookshelfId/books/:bookId', bookshelfController.removeBookFromBookshelf);

export default router;
