const bookReviewService = require('../services/bookReview.service');

exports.createReview = async (req, res, next) => {
  const { bookId } = req.params;
  const { content } = req.body;
  let userId, username;
  if (req.user && req.user.id && req.user.username) {
    userId = req.user.id;
    username = req.user.username;
  } else if (req.headers['x-user-id'] && req.headers['x-username']) {
    userId = req.headers['x-user-id'];
    username = req.headers['x-username'];
  } else {
    return res.status(401).json({ error: 'Usuario no autenticado: faltan x-user-id o x-username' });
  }
  if (!userId || !username) {
    return res.status(400).json({ error: 'Faltan datos de usuario: x-user-id o x-username' });
  }
  try {
    const review = await bookReviewService.createReview(bookId, userId, username, content);
    res.json(review);
  } catch (err) {
    return next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  const { bookId } = req.params;
  try {
    const reviews = await bookReviewService.getReviews(bookId);
    res.json(reviews);
  } catch (err) {
    return next(err);
  }
};
