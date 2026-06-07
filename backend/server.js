require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const initBot = require('./bot/telegramBot');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');

// Initialize MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Set global Socket.io instance so controller can access it
global.io = io;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Support base64 images

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Serverda ichki xatolik yuz berdi' });
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`🔌 Yangi mijoz ulandi: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`🔌 Mijoz uzildi: ${socket.id}`);
  });
});

// Initialize Telegram Bot
const bot = initBot();
global.telegramBot = bot;

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} portida ishlamoqda`);
});
