const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,

    required: true,
    index: true

  },
  bookId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  price: {
    type: Number,

    required: true,
    min: 0

  },
  coverImage: {
    type: String,
    required: true
  },
  category: {
    type: String,

    required: true

  }
}, {
  timestamps: true
});


// Compound index to ensure a user can't favorite the same book twice

favoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);