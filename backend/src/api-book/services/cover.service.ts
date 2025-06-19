import { PrismaClient } from '@prisma/client';
import { saveCover, getCoverByBookId } from '../../config/mongo.service';

const prisma = new PrismaClient();

export class CoverService {
  async uploadCover({ bookId, userId, buffer, mimeType }: { bookId: string, userId: string, buffer: Buffer, mimeType: string }) {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new Error(JSON.stringify({ code: 'NOT_FOUND', message: 'Book not found' }));
    if (book.userId !== userId) throw new Error(JSON.stringify({ code: 'FORBIDDEN', message: 'No autorizado para cambiar la portada' }));
    return await saveCover({ bookId, buffer, mimeType });
  }

  async getCoverByBookId(bookId: string) {
    return await getCoverByBookId(bookId);
  }
}
