const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const sessionId = req.cookies.sessionId;

    if (!accessToken || !sessionId) {
      return next();
    }

    try {
      // Verify access token
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      return next();
    } catch (error) {
      // Access token expired, try to refresh
      const refreshToken = await RefreshToken.findOne({
        userId: sessionId,
        isRevoked: false,
        expiryDate: { $gt: new Date() }
      });

      if (!refreshToken) {
        return res.status(401).json({ message: 'Please login again' });
      }

      // Generate new access token
      const user = await User.findOne({ phoneNumber: sessionId });
      const newAccessToken = generateAccessToken(user);

      // Send new access token
      res.set('New-Access-Token', newAccessToken);
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};