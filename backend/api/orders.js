const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const orderRoutes = require('../routes/orderRoutes'); // Adjust the path as necessary
const Order = require('../models/Order'); // Adjust the path as necessary
const cron = require('node-cron');
const app = require('../server'); // Adjust the path

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/orders', orderRoutes);

const deleteOldOrders = async () => {
  try {
    const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000);
    await Order.deleteMany({ date: { $lt: twentyHoursAgo } });
    console.log('Old orders deleted successfully');
  } catch (error) {
    console.error('Error deleting old orders:', error);
  }
};

cron.schedule('0 */20 * * *', () => {
  console.log('Running scheduled task to delete old orders...');
  deleteOldOrders();
});

app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// Export the app as a serverless function

module.exports = app;
