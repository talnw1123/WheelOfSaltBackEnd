const SlipProduct = require('../models/slipProductModel');

// Controller to get purchase history by email
const getPurchaseHistoryByEmail = async (req, res) => {
  const email  = req.params.email;
    
  try {
    const purchaseHistory = await SlipProduct.find({ email });
    res.status(200).json(purchaseHistory);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching purchase history', error: error.message });
  }
};

module.exports = 
  getPurchaseHistoryByEmail

