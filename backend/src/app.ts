import express, { Application } from 'express';
import cors from 'cors';
import { userRouter } from './api-user';
import { bookRouter } from './api-book'; 

export class App {
  private app: Application = express();
  private port: number = Number(process.env.PORT) || 3000;

  constructor() {
    this.setMiddlewares();
    this.setRouters();
  }

  private setMiddlewares(): void {
    // Configuración básica de CORS
    this.app.use(cors());
    
    // Parseo JSON
    this.app.use(express.json());
    
    // Parseo URL
    this.app.use(express.urlencoded({ extended: true }));
    
    // Carpeta pública
    this.app.use(express.static('public'));
  }

  private setRouters(): void {
    this.app.use('/api/users', userRouter);
    this.app.use('/api/books', bookRouter); 
  }

  public run(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}