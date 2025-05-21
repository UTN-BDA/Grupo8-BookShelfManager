import { BookRouter } from './routes/book.routes';
import bookController from './controller/book.controller';

export const bookRouter = new BookRouter(bookController).getRouter();