const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public
const getTables = async (req, res) => {
  try {
    const tables = await Table.find({}).sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new table
// @route   POST /api/tables
// @access  Private/Admin
const createTable = async (req, res) => {
  const { tableNumber } = req.body;

  if (!tableNumber) {
    return res.status(400).json({ message: 'Stol raqami kiritilishi shart' });
  }

  try {
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({ message: 'Ushbu stol raqami allaqachon ro\'yxatdan o\'tgan' });
    }

    // Standard deep-link for scanning QR code: redirects to bot with start parameter.
    // Replace BOT_USERNAME with the actual bot username in usage.
    const qrCode = `https://t.me/YOUR_BOT_USERNAME?start=table_${tableNumber}`;

    const table = new Table({
      tableNumber,
      qrCode,
    });

    const createdTable = await table.save();
    res.status(201).json(createdTable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTables,
  createTable,
};
