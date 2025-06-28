const express = require('express');
const router = express.Router();
const passport = require('../passport');
const jwt = require('jsonwebtoken');

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: true
}), async (req, res) => {
  // Tạo access token cho user
  const user = req.user;
  const accessToken = jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  // Có thể tạo refreshToken nếu muốn
  // Redirect về frontend kèm accessToken
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}`);
});

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/login',
  session: true
}), async (req, res) => {
  const user = req.user;
  const accessToken = jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  res.redirect(`${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}`);
});

module.exports = router;