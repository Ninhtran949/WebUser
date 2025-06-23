const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { 
  getBestsellerBooks,
  getTrendingBooks,
  getFeaturedBooks,
  getNewArrivals,
  getChildrensBooks
} = require('../controllers/bookController');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find()
      .populate('productId')
      .exec();
    
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bestseller books
router.get('/bestsellers', getBestsellerBooks);

// Get trending books
router.get('/trending', getTrendingBooks);

// Get featured books
router.get('/featured', getFeaturedBooks);

// Get new arrivals
router.get('/new-arrivals', getNewArrivals);

// Get children's books
router.get('/childrens', getChildrensBooks);

// Get related books by category
router.get('/related/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { excludeId } = req.query;
    
    const query = { category: new RegExp(category, 'i') }; // Case insensitive search
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const books = await Book.find(query)
      .populate('productId')
      .limit(6)
      .exec();
    
    res.json(books || []); // Return empty array if no books found
  } catch (err) {
    console.error('Error fetching related books:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
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
    category: req.body.category,
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

// Add new endpoint to get book by productId
router.get('/product/:productId', async (req, res) => {
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

module.exports = router;