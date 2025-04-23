const mongoose = require('mongoose');
const { sampleProducts, sampleBooks } = require('./sampleData');
const Product = require('../models/Product');
const Book = require('../models/Book');
require('dotenv').config();
const MONGODB_URI = process.env.DATABASE_URL;

async function seedDatabase() {
  try {
    // Kết nối database
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    //// Xóa dữ liệu cũ
    //await Product.deleteMany({});
    //await Book.deleteMany({});
    //console.log('Cleaned old data');

    // Import Products và lưu kết quả
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`${createdProducts.length} Products seeded successfully`);

    // Map books với products tương ứng
    const booksWithRefs = sampleBooks.map((book, index) => {
      // Tìm product tương ứng dựa vào tên sách
      const relatedProduct = createdProducts.find(
        p => p.nameProduct === sampleProducts[index].nameProduct
      );
      
      if (!relatedProduct) {
        console.warn(`No matching product found for book: ${book.author}`);
        return null;
      }
      
      console.log(`Mapping book "${book.author}" with product "${relatedProduct.nameProduct}"`);
      
      return {
        ...book,
        productId: relatedProduct._id // Gán _id của product vào productId của book
      };
    }).filter(book => book !== null); // Loại bỏ các book không có product tương ứng

    console.log(`Mapped ${booksWithRefs.length} books with products`);

    // Import Books
    const createdBooks = await Book.insertMany(booksWithRefs);
    console.log(`${createdBooks.length} Books seeded successfully`);

    console.log('All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedDatabase();