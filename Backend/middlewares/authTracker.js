// Auth Tracking Middleware
const logger = require('../config/logger');

const authTracker = (req, res, next) => {
    const trackAuth = () => {
        const user = req.user;
        const path = req.path;
        const method = req.method;

        logger.info('Auth Activity Tracked', {
            userId: user?.id,
            path,
            method,
            timestamp: new Date(),
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        // Track failed login attempts
        if (path === '/user/login' && res.statusCode === 401) {
            logger.warn('Failed Login Attempt', {
                ip: req.ip,
                timestamp: new Date(),
                userAgent: req.get('user-agent')
            });
        }
    };

    res.on('finish', trackAuth);
    next();
};

module.exports = authTracker;