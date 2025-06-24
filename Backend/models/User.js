const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const secretKey = process.env.ENCRYPTION_SECRET_KEY; // khóa bí mật từ biến môi trường

// Define User schema
const userSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    set: encrypt,
    get: decrypt
  },
  id: {
    type: String,
    required: true,
    unique: true // Đảm bảo id là duy nhất
  },
  name: {
    type: String,
    required: true,
    set: encrypt,
    get: decrypt
  },
  password: {
    type: String,
    required: true
    // Removed encrypt/decrypt for password since it's handled by bcrypt
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true // Đảm bảo phoneNumber là duy nhất
  },
  strUriAvatar: {
    type: String,
    default: '',
    set: encrypt,
    get: decrypt
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    set: encrypt,
    get: decrypt
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'facebook', null],
    default: null
  },
  oauthId: {
    type: String,
    sparse: true,
    index: true
  }
}, { 
  toJSON: { getters: true },
  // Thêm pre-save middleware để đảm bảo id = phoneNumber
  pre: [
    ['save', function(next) {
      if (this.isModified('phoneNumber')) {
        this.id = this.phoneNumber;
      }
      next();
    }]
  ]
});

function encrypt(value) {
  if (!value) return;
  try {
    return CryptoJS.AES.encrypt(value, secretKey).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return value;
  }
}

function decrypt(value) {
  if (!value) return;
  try {
    const bytes = CryptoJS.AES.decrypt(value, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return value;
  }
}

// Middleware: Trim các trường quan trọng trước khi lưu hoặc update
function trimUserFields(doc) {
  if (doc.address) doc.address = doc.address.trim();
  if (doc.phoneNumber) doc.phoneNumber = doc.phoneNumber.trim();
  if (doc.name) doc.name = doc.name.trim();
  if (doc.email) doc.email = doc.email.trim();
}

userSchema.pre('save', function(next) {
  trimUserFields(this);
  next();
});

userSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update) {
    if (update.address) update.address = update.address.trim();
    if (update.phoneNumber) update.phoneNumber = update.phoneNumber.trim();
    if (update.name) update.name = update.name.trim();
    if (update.email) update.email = update.email.trim();
  }
  next();
});

// Export User model
module.exports = mongoose.model('User', userSchema);
