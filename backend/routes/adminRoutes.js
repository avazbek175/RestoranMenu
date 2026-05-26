const express = require('express');
const router = express.Router();
const { loginAdmin, getUsers, updateAdminCredentials } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/users', protectAdmin, getUsers);
router.put('/update-credentials', protectAdmin, updateAdminCredentials);

module.exports = router;
