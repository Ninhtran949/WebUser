// Backend/seeders/seeder2.js
const mongoose = require('mongoose');
const path = require('path');
const Product = require('../models/Product');
const Book = require('../models/Book');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const MONGODB_URI = process.env.DATABASE_URL;
async function seedBooksForProducts() {
  await mongoose.connect(MONGODB_URI); // sửa lại connection string

  const products = await Product.find();
  for (const product of products) {
    const book = await Book.findOne({ productId: product._id });
    if (!book) {
      // Tạo Book mới với thông tin từ Product, các trường không có thì để mặc định là " "
      await Book.create({
        productId: product._id,
        author: product.userPartner || " ",
        category: product.codeCategory || " ",
        isbn13: " ",
        publisher: " ",
        publicationDate: new Date(),
        pages: 0,
        overview: " ",
        editorialReviews: [],
        customerReviews: []
      });
      console.log(`Đã tạo Book cho Product ${product._id}`);
    }
  }
  mongoose.disconnect();
}

seedBooksForProducts();