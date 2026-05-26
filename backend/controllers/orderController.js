const Order = require('../models/Order');

// Helper to generate a unique short order ID (e.g., #ORD-4927)
const generateOrderId = () => {
  return `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  const { tableNumber, items, totalPrice, user } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Savat bo\'sh bo\'lishi mumkin emas' });
  }

  try {
    const orderId = generateOrderId();

    const order = new Order({
      orderId,
      tableNumber,
      items,
      totalPrice,
      user,
    });

    const createdOrder = await order.save();

    // 1. Emit socket notification to Admin Panel
    if (global.io) {
      global.io.emit('newOrder', createdOrder);
    }

    // 2. Send Telegram Notification to Admin Bot
    if (global.telegramBot && process.env.ADMIN_TELEGRAM_IDS) {
      const adminIds = process.env.ADMIN_TELEGRAM_IDS.split(',');
      const itemsList = createdOrder.items
        .map((item) => `• ${item.name} x${item.quantity}`)
        .join('\n');

      const messageText = `🍽 **Yangi buyurtma: ${createdOrder.orderId}**\n\n` +
        `🪑 **Stol:** ${createdOrder.tableNumber}\n\n` +
        `📦 **Taomlar:**\n${itemsList}\n\n` +
        `💰 **Umumiy:** ${createdOrder.totalPrice.toLocaleString('uz-UZ')} so'm\n` +
        `⏰ **Vaqt:** ${new Date(createdOrder.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}\n` +
        `👤 **Mijoz:** ${createdOrder.user?.firstName || 'Mehmon'} (@${createdOrder.user?.username || 'no_user'})`;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '👨‍🍳 Preparing', callback_data: `status_Preparing_${createdOrder._id}` },
            { text: '✅ Delivered', callback_data: `status_Delivered_${createdOrder._id}` }
          ]
        ]
      };

      for (const adminId of adminIds) {
        try {
          await global.telegramBot.sendMessage(adminId.trim(), messageText, {
            parse_mode: 'Markdown',
            reply_markup: keyboard
          });
        } catch (botError) {
          console.error(`Telegram Bot xabarni adminga yubora olmadi (${adminId}):`, botError.message);
        }
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    // Return sorted orders, newest first
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order status (for tracking on WebApp)
// @route   GET /api/orders/track/:orderId
// @access  Public
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Buyurtma topilmadi' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Preparing', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: 'Yaroqsiz status' });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();

      // Emit real-time status update to frontend
      if (global.io) {
        global.io.emit('orderStatusUpdated', {
          _id: order._id,
          orderId: order.orderId,
          status: order.status,
        });
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Buyurtma topilmadi' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  trackOrder,
  updateOrderStatus,
};
