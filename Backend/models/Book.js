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
    type: mongoose.Schema.Types.ObjectId,  // Kiểu ObjectId
    ref: 'Product',  // Tham chiếu đến model Product
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn13: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  publicationDate: {
    type: Date,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  editorialReviews: [reviewSchema],
  customerReviews: [customerReviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);