import { addReview, getReviewsByBookId } from '../mongo/review.mongo';

export class ReviewService {
  async addReview({ bookId, userId, username, content }: { bookId: string, userId: string, username: string, content: string }) {
    return await addReview({ bookId, userId, username, content, createdAt: new Date() });
  }

  async getReviewsByBookId(bookId: string) {
    return await getReviewsByBookId(bookId);
  }
}
