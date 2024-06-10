const User = require('../models/userModel');
const Product = require('../models/productModel');
const SlipHistory = require('../models/slipHistoryModel');
const mongoose = require('mongoose');

// Get the total number of users
const getTotalUsers = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ count: userCount });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get the total number of products
const getTotalProducts = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.json({ count: productCount });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get the total stock (sum of all items' information length)
const getTotalStock = async (req, res) => {
  try {
    const products = await Product.find();
    const totalStock = products.reduce((total, product) => {
      return total + product.items.reduce((itemTotal, item) => itemTotal + item.information.length, 0);
    }, 0);
    res.json({ count: totalStock });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get the total amount of top-ups today
const getTotalAmountToday = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const totalAmount = await SlipHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    res.json({ total: totalAmount[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getTotalUsers,
  getTotalProducts,
  getTotalStock,
  getTotalAmountToday,
};
