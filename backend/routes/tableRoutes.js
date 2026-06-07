const express = require('express');
const router = express.Router();
const { getTables, createTable, deleteTable } = require('../controllers/tableController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTables)
  .post(protectAdmin, createTable);

router.route('/:id')
  .delete(protectAdmin, deleteTable);

module.exports = router;
