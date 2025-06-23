const BookCover = require('../../models/bookCover.model');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.uploadCover = async (bookId, imageUrl, userId) => {
  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) throw new Error('NOT_FOUND');
  if (book.createdBy !== userId) throw new Error('FORBIDDEN');
  const cover = await BookCover.findOneAndUpdate(
    { bookId },
    { imageUrl, uploadedBy: userId, uploadedAt: new Date() },
    { upsert: true, new: true }
  );
  return cover;
};

exports.getCover = async (bookId) => {
  return BookCover.findOne({ bookId });
};
