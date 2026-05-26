const express = require('express');
const router = express.Router();
const { getFoods, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFoods)
  .post(protectAdmin, createFood);

router.route('/:id')
  .get(getFoodById)
  .put(protectAdmin, updateFood)
  .delete(protectAdmin, deleteFood);

module.exports = router;
