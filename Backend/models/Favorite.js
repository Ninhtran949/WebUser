const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
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
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Tạo compound index để đảm bảo mỗi user chỉ có thể thêm một sách vào favorites một lần
favoriteSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);