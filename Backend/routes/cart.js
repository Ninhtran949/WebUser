const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Nhận `io` như tham số
module.exports = (io) => {
    // Lấy Cart theo phoneNumber (userClient)
  router.get('/user/:userClient', async (req, res) => {
    try {
      // Validate userClient parameter
      const userClient = req.params.userClient;
      if (!userClient || userClient.trim() === '' || userClient === ' ') {
        return res.status(400).json({ 
          message: 'Invalid user identifier. Please update your profile with a valid phone number.',
          code: 'INVALID_USER_ID'
        });
      }

      const carts = await Cart.find({ userClient: userClient })
        .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
      res.status(200).json(carts || []);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Tạo Cart mới
  router.post('/', async (req, res) => {
    try {
      console.log('Received payload:', req.body); // Thêm logging

      // Lấy thông tin sản phẩm từ Product
      const product = await Product.findOne({ codeProduct: req.body.idProduct });
      console.log('Found product:', product); // Thêm logging

      if (!product) {
        return res.status(404).json({ 
          message: 'Product not found',
          requestedId: req.body.idProduct 
        });
      }

      // Kiểm tra sản phẩm trong giỏ hàng
      const existingCart = await Cart.findOne({
        userClient: req.body.userClient,
        idProduct: product.codeProduct
      });

      if (existingCart) {
        // Cập nhật số lượng nếu đã tồn tại
        existingCart.numberProduct += req.body.numberProduct;
        existingCart.totalPrice = existingCart.priceProduct * existingCart.numberProduct;
        const updatedCart = await existingCart.save();
        io.emit('cartUpdated', updatedCart);
        return res.status(200).json(updatedCart);
      }

      // Tạo mới cart với thông tin từ product
      const cart = new Cart({
        idProduct: product.codeProduct,
        idCategory: product.codeCategory,
        imgProduct: product.imgProduct,
        idPartner: product.userPartner,
        nameProduct: product.nameProduct,
        userClient: req.body.userClient,
        priceProduct: parseFloat(product.priceProduct),
        numberProduct: parseInt(req.body.numberProduct),
        totalPrice: parseFloat(product.priceProduct) * parseInt(req.body.numberProduct)
      });

      const newCart = await cart.save();
      io.emit('cartCreated', newCart);
      res.status(201).json(newCart);
    } catch (err) {
      console.error('Error creating cart:', err);
      res.status(400).json({ message: err.message });
    }
  });

  // Cập nhật Cart
  router.patch('/idCart/:idCart', async (req, res) => {
    try {
      const cart = await Cart.findOne({ idCart: req.params.idCart });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      if (req.body.numberProduct !== undefined) {
        cart.numberProduct = parseInt(req.body.numberProduct);
        cart.totalPrice = cart.priceProduct * cart.numberProduct;
      }

      const updatedCart = await cart.save();
      io.emit('cartUpdated', updatedCart);
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  // Xóa Cart theo idCart
  router.delete('/:idCart', async (req, res) => {
    try {
      const cart = await Cart.findOneAndDelete({ idCart: req.params.idCart });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      io.emit('cartDeleted', { idCart: req.params.idCart });
      res.status(200).json({ message: 'Cart deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Xóa tất cả Cart của một user
  router.delete('/user/:userClient', async (req, res) => {
    try {
      const result = await Cart.deleteMany({ userClient: req.params.userClient });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No carts found for this user' });
      }
      io.emit('cartsClearedForUser', { userClient: req.params.userClient });
      res.status(200).json({ message: 'All carts deleted for this user', count: result.deletedCount });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};
