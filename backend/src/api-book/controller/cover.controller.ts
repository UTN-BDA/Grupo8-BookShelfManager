import { Request, Response } from 'express';
import { CoverService } from '../services/cover.service';

const coverService = new CoverService();

export class CoverController {
  static async uploadCover(req: Request, res: Response) {
    const { bookId } = req.params;
    const userId = req.body.userId;
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    try {
      const coverId = await coverService.uploadCover({
        bookId,
        userId,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
      });
      res.json({ coverId });
    } catch (err: any) {
      let errorObj;
      try { errorObj = JSON.parse(err.message); } catch { errorObj = {}; }
      if (errorObj?.code === 'FORBIDDEN') {
        return res.status(403).json({ error: errorObj.message });
      }
      if (errorObj?.code === 'NOT_FOUND') {
        return res.status(404).json({ error: errorObj.message });
      }
      res.status(500).json({ error: 'Error interno al subir la portada' });
    }
  }

  static async getCover(req: Request, res: Response) {
    const { bookId } = req.params;
    const cover = await coverService.getCoverByBookId(bookId);
    if (!cover) return res.status(404).json({ error: 'Not found' });
    res.set('Content-Type', cover.mimeType);
    res.send(cover.image.buffer ?? cover.image);
  }
}
