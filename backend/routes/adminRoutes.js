const express = require('express');
const router = express.Router();
const { loginAdmin, getUsers } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/users', protectAdmin, getUsers);

module.exports = router;
