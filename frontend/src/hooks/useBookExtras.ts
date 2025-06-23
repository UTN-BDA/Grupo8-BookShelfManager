import { useState, useEffect, useCallback } from 'react';
import { getBookCover, uploadBookCover, updateBookCover, getBookReviews, addBookReview } from '../services/bookExtraService';
import type { BookReview } from '../types/bookReview';

export function useBookCover(bookId: string) {
  const [cover, setCover] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBookCover(bookId)
      .then(data => setCover(data.imageUrl))
      .catch(() => setCover(null))
      .finally(() => setLoading(false));
  }, [bookId]);

  const uploadCover = useCallback(async (imageUrl: string) => {
    const data = await uploadBookCover(bookId, imageUrl);
    setCover(data.imageUrl);
  }, [bookId]);

  const changeCover = useCallback(async (imageUrl: string) => {
    const data = await updateBookCover(bookId, imageUrl);
    setCover(data.imageUrl);
  }, [bookId]);

  return { cover, loading, uploadCover, changeCover };
}

export function useBookReviews(bookId: string) {
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBookReviews(bookId)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, [bookId]);

  const addReview = useCallback(async (content: string) => {
    const review = await addBookReview(bookId, content);
    setReviews(prev => [review, ...prev]);
  }, [bookId]);

  return { reviews, loading, addReview };
}
