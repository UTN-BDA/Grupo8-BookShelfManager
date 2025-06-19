import { BaseRouter } from '../../utils';
import { BookController } from '../controller/book.controller';
import { CoverController } from '../controller/cover.controller';
import { ReviewController } from '../controller/review.controller';
import multer from 'multer';

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

    // Cover routes
    const upload = multer();
    this.router.post('/:bookId/cover', upload.single('image'), (req, res) => CoverController.uploadCover(req, res));
    this.router.get('/:bookId/cover', (req, res) => CoverController.getCover(req, res));

    // Review routes
    this.router.post('/:bookId/reviews', (req, res) => ReviewController.addReview(req, res));
    this.router.get('/:bookId/reviews', (req, res) => ReviewController.getReviews(req, res));
  }
}