import { BaseRouter } from '../../utils';
import * as bookshelfController from '../controller/bookshelf.controller';

export class BookshelfRouter extends BaseRouter<typeof bookshelfController> {
  constructor(controller: typeof bookshelfController) {
    super(controller);
  }

  protected setRoutes(): void {
    this.router.post('/', (req, res) => this.controller.createBookshelf(req, res));
    this.router.get('/user/:userId', (req, res) => this.controller.getBookshelfsByUser(req, res));
    this.router.get('/:id', (req, res) => this.controller.getBookshelfById(req, res));
    this.router.put('/:id', (req, res) => this.controller.updateBookshelf(req, res));
    this.router.delete('/:id', (req, res) => this.controller.deleteBookshelf(req, res));
    this.router.post('/:bookshelfId/books', (req, res) => this.controller.addBookToBookshelf(req, res));
    this.router.put('/:bookshelfId/books/:bookId', (req, res) => this.controller.updateBookshelfBook(req, res));
    this.router.delete('/:bookshelfId/books/:bookId', (req, res) => this.controller.removeBookFromBookshelf(req, res));
  }
}

const router = new BookshelfRouter(bookshelfController).getRouter();
export default router;
