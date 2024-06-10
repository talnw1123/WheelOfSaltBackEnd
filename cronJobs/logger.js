const cron = require('node-cron');
const Log = require('../models/logModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const SlipHistory = require('../models/slipHistoryModel');

async function logDashboardData() {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const totalStock = await Product.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, total: { $sum: { $size: "$items.information" } } } },
      { $project: { _id: 0, total: 1 } }
    ]);
    const stockCount = totalStock[0] ? totalStock[0].total : 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const totalAmountToday = await SlipHistory.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
      { $project: { _id: 0, total: 1 } }
    ]);
    const amountToday = totalAmountToday[0] ? totalAmountToday[0].total : 0;

    const newLog = new Log({
      totalUsers,
      totalProducts,
      stockCount,
      amountToday,
    });

    await newLog.save();
    console.log('Dashboard data logged successfully.');
  } catch (err) {
    console.error('Error logging dashboard data:', err);
  }
}

// Schedule the cron job to run at midnight every day
cron.schedule('0 0 * * *', logDashboardData);

module.exports = logDashboardData;
