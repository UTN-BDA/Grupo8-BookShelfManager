const BookReview = require('../../models/bookReview.model');

exports.createReview = async (bookId, userId, username, content) => {
  return BookReview.create({
    bookId,
    userId,
    username,
    content,
    createdAt: new Date(),
  });
};

exports.getReviews = async (bookId) => {
  return BookReview.find({ bookId }).sort({ createdAt: -1 });
};
