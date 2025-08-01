import express, { Application } from 'express';
import cors from 'cors';
import { userRouter } from './api-user';
import { bookRouter } from './api-book'; 
import { bookshelfRouter } from './api-bookshelf';
import connectMongo from './config/mongo';

export class App {
  private readonly app: Application = express();
  private readonly port: number = Number(process.env.PORT) || 3000;

  constructor() {
    connectMongo();
    this.setMiddlewares();
    this.setRouters();
  }

  private setMiddlewares(): void {
    this.app.use(cors({
      origin: ['http://localhost:5173', 'http://localhost:5174'],
      credentials: true, // Permite el uso de credenciales
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-user-id', 'x-username'] // <-- Agregado x-username
    }));
    
    // Parseo JSON
    this.app.use(express.json({ limit: '5mb' }));
    
    // Parseo URL
    this.app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    
    // Carpeta pública
    this.app.use(express.static('public'));
  }

  private setRouters(): void {
    this.app.use('/api/users', userRouter);
    this.app.use('/api/books', bookRouter);
    this.app.use('/api/bookshelfs', bookshelfRouter);
  }

  public run(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}