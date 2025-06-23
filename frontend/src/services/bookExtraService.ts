import api from './api';

export const getBookCover = async (bookId: string) => {
  const res = await api.get(`/books/cover/${bookId}`);
  return res.data;
};

export const uploadBookCover = async (bookId: string, imageUrl: string) => {
  const userStr = localStorage.getItem('user');
  const headers: Record<string, string> = {};
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user?.id) headers['x-user-id'] = user.id;
    if (user?.username) headers['x-username'] = user.username;
  }
  const res = await api.post(`/books/cover/${bookId}`, { imageUrl }, { headers });
  return res.data;
};

export const updateBookCover = async (bookId: string, imageUrl: string) => {
  const userStr = localStorage.getItem('user');
  const headers: Record<string, string> = {};
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user?.id) headers['x-user-id'] = user.id;
    if (user?.username) headers['x-username'] = user.username;
  }
  const res = await api.put(`/books/cover/${bookId}`, { imageUrl }, { headers });
  return res.data;
};

export const getBookReviews = async (bookId: string) => {
  const res = await api.get(`/books/reviews/${bookId}`);
  return res.data;
};

export const addBookReview = async (bookId: string, content: string) => {
  const userStr = localStorage.getItem('user');
  const headers: Record<string, string> = {};
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user?.id) headers['x-user-id'] = user.id;
    if (user?.username) headers['x-username'] = user.username;
  }
  const res = await api.post(`/books/reviews/${bookId}`, { content }, { headers });
  return res.data;
};
