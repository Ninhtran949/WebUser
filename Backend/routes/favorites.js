const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// Lấy favorites của user
router.get('/user/:phoneNumber', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.phoneNumber });
    // Luôn trả về mảng, ngay cả khi rỗng
    res.status(200).json(favorites || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Thêm sách vào favorites
router.post('/', async (req, res) => {
  // Validate required fields
  if (!req.body.phoneNumber) {
    return res.status(400).json({ message: 'User phone number is required' });
  }
  if (!req.body.bookId) {
    return res.status(400).json({ message: 'Book ID is required' });
  }

  const favorite = new Favorite({
    userId: req.body.phoneNumber, // Sử dụng phoneNumber làm userId
    bookId: req.body.bookId,
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    coverImage: req.body.coverImage,
    category: req.body.category
  });

  try {
    const newFavorite = await favorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    // Nếu lỗi là duplicate key, có nghĩa là sách đã được thêm vào favorites
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Book already in favorites' });
    }
    res.status(400).json({ message: err.message });
  }
});

// Xóa một sách khỏi favorites
router.delete('/:phoneNumber/:bookId', async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.params.phoneNumber,
      bookId: req.params.bookId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.status(200).json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Xóa tất cả favorites của một user
router.delete('/user/:phoneNumber', async (req, res) => {
  try {
    const result = await Favorite.deleteMany({ userId: req.params.phoneNumber });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No favorites found for this user' });
    }
    res.status(200).json({ message: 'All favorites removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;