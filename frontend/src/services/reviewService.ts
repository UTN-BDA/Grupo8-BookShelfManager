import api from './api';

export interface Review {
  _id?: string;
  bookId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export const reviewService = {
  async getReviewsByBookId(bookId: string): Promise<Review[]> {
    const res = await api.get<Review[]>(`/reviews/${bookId}`);
    return res.data;
  },
  async addReview(review: Omit<Review, '_id' | 'createdAt'>): Promise<{ reviewId: string }> {
    const res = await api.post<{ reviewId: string }>(`/reviews`, review);
    return res.data;
  },
};
