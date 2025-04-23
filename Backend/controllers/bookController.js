const Book = require('../models/Book');

const getBestsellerBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('productId')
      .limit(10)
      .exec();

    if (!books || books.length === 0) {
      return res.status(404).json({ message: 'No bestseller books found' });
    }

    res.json(books);
  } catch (error) {
    console.error('Error fetching bestseller books:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBestsellerBooks,
  // ...other exports
};