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
    // Ensure at least one admin user exists in DB
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('Seeding default Admin credentials to MongoDB...');
      const defaultAdminPasswordHash = await bcrypt.hash('admingold2026', 10);
      await User.create({
        telegramId: 'ADMIN_STATIC',
        firstName: 'System Admin',
        username: 'admin',
        role: 'admin',
        password: defaultAdminPasswordHash,
      });
    }

    // Lookup admin in MongoDB
    const adminUser = await User.findOne({ username, role: 'admin' });
    if (adminUser) {
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (isMatch) {
        return res.json({
          _id: adminUser._id,
          firstName: adminUser.firstName,
          username: adminUser.username,
          role: adminUser.role,
          token: generateToken(adminUser._id),
        });
      }
    }

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

// @desc    Update Admin credentials
// @route   PUT /api/admin/update-credentials
// @access  Private/Admin
const updateAdminCredentials = async (req, res) => {
  const { newUsername, newPassword } = req.body;

  if (!newUsername) {
    return res.status(400).json({ message: 'Login nomi bo\'sh bo\'lishi mumkin emas' });
  }

  try {
    const adminUser = await User.findById(req.user._id);

    if (!adminUser) {
      return res.status(404).json({ message: 'Admin topilmadi' });
    }

    // Check if new username is already taken by another admin
    if (newUsername !== adminUser.username) {
      const usernameExists = await User.findOne({ username: newUsername, role: 'admin' });
      if (usernameExists) {
        return res.status(400).json({ message: 'Ushbu login band. Iltimos, boshqasini kiriting' });
      }
    }

    adminUser.username = newUsername;

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' });
      }
      adminUser.password = await bcrypt.hash(newPassword, 10);
    }

    await adminUser.save();
    res.json({ message: 'Admin ma\'lumotlari muvaffaqiyatli yangilandi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  getUsers,
  updateAdminCredentials,
};
