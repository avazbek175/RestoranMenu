const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/telegram-restaurant');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB connection error: ${error.message}`);
    console.log('⚠️ Eslatma: MongoDB serveri ishlamayapti yoki manzil noto\'g\'ri. Loyihani demo/offline rejimda tekshirishingiz mumkin. Server ishlayveradi va Mongoose fonda qayta ulanishga harakat qiladi.');
  }
};

module.exports = connectDB;
