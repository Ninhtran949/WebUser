const Book = require('../models/Book');

const getBestsellerBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('productId')
      .limit(10)
      .exec();

    res.json(books || []);
  } catch (error) {
    console.error('Error fetching bestseller books:', error);
    res.status(500).json({ message: error.message });
  }
};

const getTrendingBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('productId')
      .limit(12)
      .exec();

    res.json(books || []);
  } catch (error) {
    console.error('Error fetching trending books:', error);
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('productId')
      .limit(7)
      .exec();

    res.json(books || []);
  } catch (error) {
    console.error('Error fetching featured books:', error);
    res.status(500).json({ message: error.message });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('productId')
      .sort({ createdAt: -1 })
      .limit(12)
      .exec();

    res.json(books || []);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ message: error.message });
  }
};

const getChildrensBooks = async (req, res) => {
  try {
    const books = await Book.find({ category: 'Children' }) //find books with category "Children"
      .populate('productId')
      .limit(6)
      .exec();

    res.json(books || []);
  } catch (error) {
    console.error('Error fetching children books:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBestsellerBooks,
  getTrendingBooks,
  getFeaturedBooks,
  getNewArrivals,
  getChildrensBooks
};