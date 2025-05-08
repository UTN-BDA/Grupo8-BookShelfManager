import { Response } from 'express';

export class ErrorResponse extends Error {
  public readonly statusCode: number;
  public readonly errors?: any;

  constructor(statusCode: number, message: string | Record<string, any>, errors?: any) {
    super(typeof message === 'string' ? message : JSON.stringify(message));
    this.statusCode = statusCode;
    this.errors = errors;

    if (typeof message === 'object') {
      this.message = message.msg ?? 'An error occurred';
    }

    Object.setPrototypeOf(this, ErrorResponse.prototype);
  }

  public static sendError(res: Response, error: any): void {
    console.error('Error:', error);
    
    if (error instanceof ErrorResponse) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
      return;
    }

    // Error de Prisma
    if (error?.name === 'PrismaClientKnownRequestError') {
      res.status(400).json({
        success: false,
        message: 'Database operation failed',
        error: error.message
      });
      return;
    }

    // Error genérico
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }

  static handleError(res: Response, error: any): void {
    const statusCode = error.statusCode ?? 500;
    const message = error.message ?? 'Internal Server Error';
    res.status(statusCode).json({ error: message });
  }
}