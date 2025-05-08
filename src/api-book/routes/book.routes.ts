import { BaseRouter } from '../../utils';
import { BookController } from '../controller/book.controller';

export class BookRouter extends BaseRouter<BookController> {
  constructor(controller: BookController) {
    super(controller);
  }

  protected setRoutes(): void {
    this.router.post('/', (req, res) => this.controller.createBook(req, res));
    this.router.put('/:id', (req, res) => this.controller.updateBook(req, res));
    this.router.delete('/:id', (req, res) => this.controller.deleteBook(req, res));
    this.router.get('/', (req, res) => this.controller.getAllBooks(req, res));
    this.router.get('/:id', (req, res) => this.controller.getBookById(req, res));
  }
}