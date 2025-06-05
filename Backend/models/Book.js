const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  content: String,
  source: String
});

const customerReviewSchema = new mongoose.Schema({
  rating: Number,
  content: String,
  author: String,
  date: String
});

const bookSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: ''
  },
  isbn13: {
    type: String,
    default: ''
  },
  publisher: {
    type: String,
    default: ''
  },
  publicationDate: {
    type: Date,
    default: Date.now
  },
  pages: {
    type: Number,
    default: 0
  },
  overview: {
    type: String,
    default: ''
  },
  editorialReviews: {
    type: [reviewSchema],
    default: []
  },
  customerReviews: {
    type: [customerReviewSchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);