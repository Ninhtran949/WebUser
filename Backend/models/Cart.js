const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  idProduct: { 
    type: Number,
    required: true,
    ref: 'Product'
  },
  idCart: { 
    type: Number,
    unique: true,
    
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
    required: true
  }
}, {
  timestamps: true
});

// Compound index for userClient and idProduct to ensure unique products per user
cartSchema.index({ userClient: 1, idProduct: 1 }, { unique: true });

// Pre-save middleware để tự động tạo idCart TRƯỚC khi tính totalPrice
cartSchema.pre('save', async function(next) {
  if (this.isNew && !this.idCart) {
    try {
      const lastCart = await this.constructor.findOne({}, {}, { sort: { idCart: -1 } });
      this.idCart = lastCart ? lastCart.idCart + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-save middleware để tính totalPrice
cartSchema.pre('save', function(next) {
  if (this.isModified('numberProduct') || this.isModified('priceProduct')) {
    this.totalPrice = this.numberProduct * this.priceProduct;
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
