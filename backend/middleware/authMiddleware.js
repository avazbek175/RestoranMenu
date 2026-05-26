const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_gold_restaurant_13579');

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Ruxsat berilmadi. Faqat adminlar kirishi mumkin.' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Ruxsat berilmadi. Yaroqsiz token.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Ruxsat berilmadi. Token topilmadi.' });
  }
};

module.exports = { protectAdmin };
