const mongoose = require('mongoose');
const dns = require('dns');

// Google DNS ishlatish (lokal DNS MongoDB SRV yozuvlarini aniqlay olmasa)
dns.setServers(['8.8.8.8', '8.8.4.4']);

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
