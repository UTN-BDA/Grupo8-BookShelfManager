import { BaseRouter } from '../../utils';
import { BookController } from '../controller/book.controller';
const bookCoverController = require('../controller/bookCover.controller');
const bookReviewController = require('../controller/bookReview.controller');

export class BookRouter extends BaseRouter<BookController> {
  constructor(controller: BookController) {
    super(controller);
  }

  protected setRoutes(): void {
    this.router.post('/', (req, res) => this.controller.createBook(req, res));
    this.router.post('/add-to-bookshelf', (req, res) => this.controller.addBookToBookshelfOrCreate(req, res));
    this.router.put('/:id', (req, res) => this.controller.updateBook(req, res));
    this.router.delete('/:id', (req, res) => this.controller.deleteBook(req, res));
    this.router.get('/', (req, res) => this.controller.getAllBooks(req, res));
    this.router.get('/:id', (req, res) => this.controller.getBookById(req, res));
    this.router.post('/cover/:bookId', (req, res) => bookCoverController.uploadCover(req, res));
    this.router.get('/cover/:bookId', (req, res) => bookCoverController.getCover(req, res));
    this.router.post('/reviews/:bookId', (req, res) => bookReviewController.createReview(req, res));
    this.router.get('/reviews/:bookId', (req, res) => bookReviewController.getReviews(req, res));
  }
}