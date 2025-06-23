const express = require('express');
const router = express.Router();
const User = require('../models/User');
const RefreshToken = require('../models/refreshToken');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const logger = require('../config/logger');

router.use(cookieParser());

// GET all Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET User by ID
router.get('/id/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get user by phonenumber
router.get('/phone/:phoneNumber', async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    const user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ phoneNumber: username });
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Revoke all existing refresh tokens for this user
    await RefreshToken.updateMany(
      { userId: user.phoneNumber, isRevoked: false },
      { isRevoked: true }
    );

    // Create new refresh token
    const refreshToken = jwt.sign(
      { id: user.phoneNumber },
      process.env.REFRESH_TOKEN_SECRET
    );

    // Save new refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user.phoneNumber,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isRevoked: false
    });

    // Generate access token
    const accessToken = generateAccessToken(user);

    // Set httpOnly cookie với session ID
    res.cookie('sessionId', user.phoneNumber, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Chỉ gửi access token về client
    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        address: user.address,
        strUriAvatar: user.strUriAvatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Đăng xuất
router.post('/logout', async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    
    if (!sessionId) {
      return res.status(200).json({ message: 'Already logged out' });
    }

    // Revoke ALL refresh tokens for this user
    const result = await RefreshToken.updateMany(
      { userId: sessionId, isRevoked: false },
      { isRevoked: true }
    );

    console.log(`Revoked ${result.modifiedCount} tokens for user ${sessionId}`);

    // Clear session cookie
    res.clearCookie('sessionId');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Tạo access token mới từ refresh token
router.post('/token', async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    // Verify và tìm token trong database
    const tokenDoc = await RefreshToken.findOne({
      token: oldRefreshToken,
      isRevoked: false
    });

    if (!tokenDoc) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Thu hồi token cũ
    tokenDoc.isRevoked = true;
    await tokenDoc.save();

    // Tạo cặp token mới
    const user = await User.findById(tokenDoc.userId);
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Set cookie mới
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// tạo user
router.post('/signup', async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    // Validate phone number
    const phoneRegex = /^(0|84|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(req.body.phoneNumber)) {
      return res.status(400).json({ 
        message: 'Invalid phone number format. Please enter a valid Vietnamese phone number.' 
      });
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
      });
    }
    
    // Kiểm tra số điện thoại đã tồn tại chưa
    const existingUser = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const user = new User({
      address: req.body.address,
      id: req.body.phoneNumber, // Sử dụng phoneNumber làm id
      name: req.body.name,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      strUriAvatar: req.body.strUriAvatar || ''
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Thay đổi mật khẩu người dùng
router.patch('/change-password/:id', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const phoneNumber = req.params.id;

  try {
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    // Validate mật khẩu mới
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a User by ID
router.patch('/id/:id', async (req, res) => {
  try {
    const phoneNumber = req.params.id;
    // Tìm user bằng phoneNumber
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Cập nhật các trường nếu được cung cấp
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.phoneNumber !== undefined) {
      // Kiểm tra xem số điện thoại mới đã tồn tại chưa
      if (req.body.phoneNumber !== phoneNumber) {
        const existingUser = await User.findOne({ phoneNumber: req.body.phoneNumber });
        if (existingUser) {
          return res.status(400).json({ message: 'Phone number already exists' });
        }
      }
      user.phoneNumber = req.body.phoneNumber;
    }
    if (req.body.strUriAvatar !== undefined) user.strUriAvatar = req.body.strUriAvatar;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a User by ID
router.delete('/id/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ id: id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'Deleted User' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Get user info
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user info
    res.json({
      id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      strUriAvatar: user.strUriAvatar
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Tạo access token mới từ refresh token
router.post('/token/refresh', async (req, res) => {
  try {
    // Lấy session ID từ cookie
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.status(401).json({ message: 'No session found' });
    }

    // Tìm refresh token trong DB
    const refreshTokenDoc = await RefreshToken.findOne({ 
      userId: sessionId,
      isRevoked: false,
      expiryDate: { $gt: new Date() }
    });

    if (!refreshTokenDoc) {
      return res.status(403).json({ message: 'Invalid session' });
    }

    // Tạo access token mới
    const user = await User.findOne({ phoneNumber: sessionId });
    const accessToken = generateAccessToken(user);

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// Hàm tạo access token
const generateAccessToken = (user) => {
  // Create a plain object with only the needed user data
  const payload = {
    id: user._id,
    username: user.username,
    phoneNumber: user.phoneNumber
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Hàm tạo refresh token
const generateRefreshToken = async (user) => {
  // Create a plain object with only the needed user data
  const payload = {
    id: user._id,
    username: user.username,
    phoneNumber: user.phoneNumber
  };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

  const refreshToken = new RefreshToken({
    token: token,
    userId: user._id,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isRevoked: false
  });

  await refreshToken.save();
  return token;
};