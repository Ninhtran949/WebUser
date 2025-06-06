//rate limiting cho các endpoint authentication
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 100, // Limit each IP to 10 login requests per window

    message: 'Too many login attempts, please try again after 15 minutes'
});

const refreshTokenLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each IP to 100 refresh requests per hour
    message: 'Too many refresh token requests'
});

module.exports = { loginLimiter, refreshTokenLimiter };