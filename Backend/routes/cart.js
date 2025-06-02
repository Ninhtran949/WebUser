const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Nhận `io` như tham số
module.exports = (io) => {
    // Lấy Cart theo phoneNumber (userClient)
  router.get('/user/:userClient', async (req, res) => {
    try {
      const carts = await Cart.find({ userClient: req.params.userClient });
      // Luôn trả về mảng, ngay cả khi trống
      res.status(200).json(carts || []);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Tạo Cart mới
  router.post('/', async (req, res) => {
    try {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingCart = await Cart.findOne({
        userClient: req.body.userClient,
        idProduct: req.body.idProduct
      });

      if (existingCart) {
        // Cập nhật số lượng nếu sản phẩm đã có
        existingCart.numberProduct += req.body.numberProduct;
        existingCart.totalPrice = existingCart.priceProduct * existingCart.numberProduct;
        const updatedCart = await existingCart.save();
        io.emit('cartUpdated', updatedCart);
        return res.status(200).json(updatedCart);
      }

      // Tạo mới sản phẩm vào giỏ hàng
      const cart = new Cart({
        idProduct: req.body.idProduct,
        idCart: req.body.idCart,
        idCategory: req.body.idCategory,
        imgProduct: req.body.imgProduct,
        idPartner: req.body.idPartner,
        nameProduct: req.body.nameProduct,
        userClient: req.body.userClient, // Đây phải là số điện thoại
        priceProduct: parseFloat(req.body.priceProduct),
        numberProduct: parseInt(req.body.numberProduct),
        totalPrice: parseFloat(req.body.totalPrice)
      });

      const newCart = await cart.save();
      io.emit('cartCreated', newCart); // Phát sự kiện khi tạo Cart
      res.status(201).json(newCart);
    } catch (err) {
      console.error('Lỗi khi tạo Cart:', err);
      res.status(400).json({ message: err.message });
    }
  });

  // Cập nhật Cart theo idCart
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
      io.emit('cartUpdated', updatedCart); // Phát sự kiện khi cập nhật Cart
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
