const bookCoverService = require('../services/bookCover.service');

exports.uploadCover = async (req, res, next) => {
  const { bookId } = req.params;
  const { imageUrl } = req.body;
  let userId;
  if (req.user && req.user.id) {
    userId = req.user.id;
  } else if (req.headers['x-user-id']) {
    userId = req.headers['x-user-id'];
  } else {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  try {
    const cover = await bookCoverService.uploadCover(bookId, imageUrl, userId);
    res.json(cover);
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Libro no encontrado' });
    if (err.message === 'FORBIDDEN') return res.status(403).json({ error: 'No autorizado' });
    return next(err);
  }
};

exports.getCover = async (req, res, next) => {
  const { bookId } = req.params;
  try {
    const cover = await bookCoverService.getCover(bookId);
    if (!cover) return res.status(404).json({ error: 'Portada no encontrada' });
    res.json(cover);
  } catch (err) {
    return next(err);
  }
};

exports.updateCover = async (req, res, next) => {
  const { bookId } = req.params;
  const { imageUrl } = req.body;
  let userId;
  if (req.user && req.user.id) {
    userId = req.user.id;
  } else if (req.headers['x-user-id']) {
    userId = req.headers['x-user-id'];
  } else {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  try {
    const cover = await bookCoverService.updateCover(bookId, imageUrl, userId);
    res.json(cover);
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Libro no encontrado' });
    if (err.message === 'FORBIDDEN') return res.status(403).json({ error: 'No autorizado' });
    return next(err);
  }
};
