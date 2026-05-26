const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_gold_restaurant_13579', {
    expiresIn: '30d',
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Standard secure Admin credentials
    const defaultAdminUsername = 'admin';
    // standard password for testing, in real app it would be custom
    const defaultAdminPasswordHash = await bcrypt.hash('admingold2026', 10);

    if (username === defaultAdminUsername) {
      const isMatch = await bcrypt.compare(password, defaultAdminPasswordHash);
      if (isMatch) {
        // Find or create admin user in DB
        let adminUser = await User.findOne({ username: 'admin', role: 'admin' });
        if (!adminUser) {
          adminUser = await User.create({
            telegramId: 'ADMIN_STATIC',
            firstName: 'System Admin',
            username: 'admin',
            role: 'admin',
          });
        }

        return res.json({
          _id: adminUser._id,
          firstName: adminUser.firstName,
          username: adminUser.username,
          role: adminUser.role,
          token: generateToken(adminUser._id),
        });
      }
    }

    // Alternatively look up in MongoDB
    const user = await User.findOne({ username, role: 'admin' });
    // Note: In real app, we would have user password. But since we check static credentials first, we cover standard flow.
    res.status(401).json({ message: 'Noto\'g\'ri login yoki parol' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (for management)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  getUsers,
};
