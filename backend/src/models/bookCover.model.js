const mongoose = require('mongoose');

const bookCoverSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BookCover', bookCoverSchema);
