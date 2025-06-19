import api from './api';

export const coverService = {
  async uploadCover(bookId: string, file: File): Promise<{ coverId: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post(`/covers/${bookId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async getCover(bookId: string): Promise<Blob> {
    const res = await api.get(`/covers/${bookId}`, { responseType: 'blob' });
    return res.data;
  },
};
