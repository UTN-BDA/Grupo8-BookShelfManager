import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';

const reviewService = new ReviewService();

export class ReviewController {
  static async addReview(req: Request, res: Response) {
    const { bookId, userId, username, content } = req.body;
    if (!bookId || !userId || !username || !content) return res.status(400).json({ error: 'Missing fields' });
    try {
      const reviewId = await reviewService.addReview({ bookId, userId, username, content });
      res.json({ reviewId });
    } catch {
      res.status(500).json({ error: 'Error interno al agregar la opinión' });
    }
  }

  static async getReviews(req: Request, res: Response) {
    const { bookId } = req.params;
    const reviews = await reviewService.getReviewsByBookId(bookId);
    res.json(reviews);
  }
}
