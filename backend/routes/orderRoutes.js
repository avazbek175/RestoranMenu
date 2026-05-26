const express = require('express');
const router = express.Router();
const { createOrder, getOrders, trackOrder, updateOrderStatus } = require('../controllers/orderController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protectAdmin, getOrders)
  .post(createOrder);

router.get('/track/:orderId', trackOrder);
router.put('/:id/status', protectAdmin, updateOrderStatus);

module.exports = router;
