const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { getBestsellerBooks } = require('../controllers/bookController');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find()
      .populate('productId')  // Thêm populate
      .exec();
    
    console.log('Books với product:', books.map(book => ({
      bookId: book._id,
      productId: book.productId?._id,
      bookName: book.author,
      productName: book.productId?.nameProduct
    })));

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bestseller books - Đặt TRƯỚC route có param
router.get('/bestsellers', getBestsellerBooks);

// Get book details - Đặt SAU route /bestsellers
router.get('/:productId', async (req, res) => {
  try {
    const book = await Book.findOne({ productId: req.params.productId })
      .populate('productId');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new book
router.post('/', async (req, res) => {
  const book = new Book({
    productId: req.body.productId,
    author: req.body.author,
    isbn13: req.body.isbn13,
    publisher: req.body.publisher,
    publicationDate: req.body.publicationDate,
    pages: req.body.pages,
    overview: req.body.overview,
    editorialReviews: req.body.editorialReviews,
    customerReviews: req.body.customerReviews
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Thêm các routes khác cho update, delete, etc.

module.exports = router;