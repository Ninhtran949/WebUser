const express = require('express');
const router = express.Router();
const passport = require('../passport');

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: true
}), (req, res) => {
  // Redirect hoặc trả về thông tin user
  res.redirect(process.env.FRONTEND_URL + '/oauth-success');
});

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/login',
  session: true
}), (req, res) => {
  res.redirect(process.env.FRONTEND_URL + '/oauth-success');
});

module.exports = router;