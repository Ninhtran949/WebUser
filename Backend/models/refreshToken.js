const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String, // Đổi thành String để lưu phoneNumber
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
