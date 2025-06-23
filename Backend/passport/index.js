const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ oauthProvider: 'google', oauthId: profile.id });
    if (!user) {
      user = await User.create({
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        oauthProvider: 'google',
        oauthId: profile.id,
        address: '',
        password: '', // Không dùng cho OAuth
        phoneNumber: '', // Có thể để trống hoặc cập nhật sau
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'emails']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ oauthProvider: 'facebook', oauthId: profile.id });
    if (!user) {
      user = await User.create({
        id: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : '',
        oauthProvider: 'facebook',
        oauthId: profile.id,
        address: '',
        password: '',
        phoneNumber: '',
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;