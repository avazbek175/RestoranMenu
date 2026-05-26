const express = require('express');
const router = express.Router();
const { getTables, createTable } = require('../controllers/tableController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTables)
  .post(protectAdmin, createTable);

module.exports = router;
