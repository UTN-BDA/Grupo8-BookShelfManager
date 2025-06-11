import { BookshelfRouter } from './routes/bookshelf.routes';
import * as bookshelfController from './controller/bookshelf.controller';

export const bookshelfRouter = new BookshelfRouter(bookshelfController).getRouter();
