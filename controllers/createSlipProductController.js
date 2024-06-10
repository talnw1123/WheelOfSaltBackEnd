const SlipProduct = require('../models/slipProductModel');

const saveSlip = async (req, res) => {
  const { productName, email, information, price } = req.body;

  if (!productName || !email || !information || !price) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const slip = new SlipProduct({
    productName,
    email,
    information,
    price,
  });

  try {
    await slip.save();
    res.status(200).json({ success: true, message: 'Slip saved successfully' });
  } catch (error) {
    console.error('Error saving slip:', error.message);
    res.status(500).json({ success: false, message: 'Error saving slip', error: error.message });
  }
};

module.exports = saveSlip;
