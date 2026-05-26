const TelegramBot = require('node-telegram-bot-api');
const Order = require('../models/Order');
const User = require('../models/User');

const initBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token || token === 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
    console.log('⚠️ TELEGRAM_BOT_TOKEN o\'rnatilmagan. Telegram bot ishga tushmadi.');
    return null;
  }

  // Initialize bot with polling
  const bot = new TelegramBot(token, { polling: true });
  console.log('🤖 Telegram bot muvaffaqiyatli ishga tushirildi (Polling)...');

  // Handle /start command
  bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const startParam = match[1]; // e.g. "table_5"
    
    let tableNumber = null;
    if (startParam && startParam.startsWith('table_')) {
      tableNumber = startParam.split('_')[1];
    }

    const firstName = msg.chat.first_name || 'Hurmatli mijoz';
    const username = msg.chat.username || '';
    
    try {
      // Save or update user in database
      await User.findOneAndUpdate(
        { telegramId: chatId.toString() },
        {
          firstName,
          username,
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Foydalanuvchini DB-da saqlashda xatolik:', err.message);
    }

    let webAppUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Telegram Bot API strictly requires HTTPS links for WebApp keyboard buttons.
    // If FRONTEND_URL is HTTP (like localhost), we show a warning and fallback to a safe placeholder HTTPS link,
    // so the bot doesn't crash, while letting the developer know they must use ngrok or HTTPS hosting.
    const isHttps = webAppUrl.startsWith('https://');
    if (!isHttps) {
      console.log(`\n⚠️ TELEGRAM BOT OGOHLANTIRISHI:\nTelegram WebApp tugmalari uchun faqat HTTPS havolalari ruxsat etiladi. '${webAppUrl}' ishlatilganda Telegram xatolik beradi.\nKlaviatura buzilmasligi uchun 'https://google.com' ishlatildi. Mahalliy loyihani ulash uchun ngrok orqali HTTPS tunnel yarating va uni .env faylida FRONTEND_URL sifatida sozlang.\n`);
      webAppUrl = 'https://google.com';
    }

    // Append table number to URL if scanned from QR code
    const fullWebAppUrl = tableNumber 
      ? `${webAppUrl}?table=${tableNumber}`
      : webAppUrl;

    let welcomeMessage = `✨ **Texas Burger** Restoraniga xush kelibsiz, ${firstName}! ✨\n\n` +
      `Bizning menyuimiz orqali taomlarni to'g'ridan-to'g'ri o'z stolingizdan buyurtma qilishingiz mumkin.`;

    if (!isHttps) {
      welcomeMessage += `\n\n⚠️ **Dasturchilar uchun eslatma:** Telegram WebApp faqat HTTPS havolalar orqali ochiladi. Mahalliy test qilish uchun ngrok-dan foydalaning. Hozirda 'Menu' tugmasi vaqtinchalik HTTPS demo havola (Google) ga yo'naltirilgan.\nMahalliy menyu manzili: http://localhost:5173`;
    }

    if (tableNumber) {
      welcomeMessage += `\n\n🪑 **Sizning stolingiz: №${tableNumber}**\n\n` +
        `Buyurtma berishni boshlash uchun quyidagi **"🍽 Menu"** tugmasini bosing.`;
    } else {
      welcomeMessage += `\n\nBuyurtma berish uchun quyidagi **"🍽 Menu"** tugmasini bosing va buyurtma berishda stolingizni tanlang.`;
    }

    const options = {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [
          [
            {
              text: '🍽 Menu',
              web_app: { url: fullWebAppUrl }
            }
          ]
        ],
        resize_keyboard: true
      }
    };

    bot.sendMessage(chatId, welcomeMessage, options);
  });

  // Handle inline buttons (Admin status updates)
  bot.on('callback_query', async (callbackQuery) => {
    const action = callbackQuery.data; // e.g. "status_Preparing_65f..."
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    if (!action || !action.startsWith('status_')) return;

    const parts = action.split('_');
    const newStatus = parts[1]; // "Preparing" or "Delivered"
    const orderId = parts[2];   // MongoDB Object ID

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return bot.answerCallbackQuery(callbackQuery.id, {
          text: 'Buyurtma topilmadi!',
          show_alert: true
        });
      }

      // Update status
      order.status = newStatus;
      await order.save();

      // Emit change via WebSockets if active
      if (global.io) {
        global.io.emit('orderStatusUpdated', {
          _id: order._id,
          orderId: order.orderId,
          status: order.status,
        });
      }

      // Update the inline telegram message to match new status
      const itemsList = order.items
        .map((item) => `• ${item.name} x${item.quantity}`)
        .join('\n');

      let statusEmoji = '⏳';
      if (newStatus === 'Preparing') statusEmoji = '👨‍🍳';
      if (newStatus === 'Delivered') statusEmoji = '✅';

      const updatedText = `🍽 **Buyurtma: ${order.orderId} [${statusEmoji} ${newStatus}]**\n\n` +
        `🪑 **Stol:** ${order.tableNumber}\n\n` +
        `📦 **Taomlar:**\n${itemsList}\n\n` +
        `💰 **Umumiy:** ${order.totalPrice.toLocaleString('uz-UZ')} so'm\n` +
        `⏰ **Vaqt:** ${new Date(order.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}\n` +
        `👤 **Mijoz:** ${order.user?.firstName || 'Mehmon'} (@${order.user?.username || 'no_user'})`;

      let keyboard = {};
      
      // If it is preparing, we still keep the Delivered button so they can complete it.
      // If Delivered, we don't need buttons anymore as it is resolved.
      if (newStatus === 'Preparing') {
        keyboard = {
          inline_keyboard: [
            [
              { text: '✅ Delivered', callback_data: `status_Delivered_${order._id}` }
            ]
          ]
        };
      } else {
        keyboard = { inline_keyboard: [] }; // Empty
      }

      await bot.editMessageText(updatedText, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });

      bot.answerCallbackQuery(callbackQuery.id, {
        text: `Buyurtma statusi "${newStatus}" holatiga o'zgartirildi!`,
        show_alert: false
      });

    } catch (error) {
      console.error('Bot callback xatolik:', error.message);
      bot.answerCallbackQuery(callbackQuery.id, {
        text: 'Statusni yangilashda xatolik yuz berdi.',
        show_alert: true
      });
    }
  });

  return bot;
};

module.exports = initBot;
