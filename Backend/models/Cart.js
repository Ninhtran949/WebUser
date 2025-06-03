const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  idProduct: { 
    type: String,
    required: true
  },
  idCart: {
    type: String,
    required: true,
    unique: true
  },
  idCategory: {
    type: String,
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
    type: String, // This will store phoneNumber
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

// Compound index for userClient and idProduct to ensure unique products per user
cartSchema.index({ userClient: 1, idProduct: 1 }, { unique: true });

// Pre-save middleware to calculate totalPrice
cartSchema.pre('save', function(next) {
  if (this.isModified('numberProduct') || this.isModified('priceProduct')) {
    this.totalPrice = this.numberProduct * this.priceProduct;
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
