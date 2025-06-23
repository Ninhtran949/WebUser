const RefreshToken = require('../models/refreshToken');

const cleanupTokens = async () => {
  try {
    const result = await RefreshToken.deleteMany({
      $or: [
        { isRevoked: true },
        { expiryDate: { $lt: new Date() } }
      ]
    });
    
    console.log(`Cleaned up ${result.deletedCount} expired/revoked tokens`);
  } catch (error) {
    console.error('Token cleanup failed:', error);
  }
};

// Run cleanup daily
setInterval(cleanupTokens, 24 * 60 * 60 * 1000);

module.exports = cleanupTokens;