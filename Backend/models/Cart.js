const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  idProduct: { 
    type: Number, 
    required: true 
  },  idCart: { 
    type: Number,
    required: true
  },
  idCategory: { 
    type: Number, 
    required: true 
  },
  imgProduct: { 
    type: String,
    required: true
  },
  idPartner: { 
    type: String,
    required: true
  },
  nameProduct: { 
    type: String,
    required: true
  },
  userClient: { 
    type: String,
    required: true,
    index: true
  },
  priceProduct: { 
    type: Number,
    required: true,
    min: 0
  },
  numberProduct: { 
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: { 
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
