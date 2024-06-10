const SlipHistory = require('../models/slipHistoryModel');

// ประวัติการเติมเงิน
exports.getSlipHistoryByEmail = async (req, res) => {
  try {
    console.log('Fetching slip history for email:', req.params.email); // Log the email being fetched
    const slipHistory = await SlipHistory.find({ email: req.params.email });
    if (slipHistory.length === 0) {
      console.log('No slip history found for email:', req.params.email);
      return res.status(404).json({ message: 'SlipHistory not found' });
    }
    console.log('Slip history found:', slipHistory); // Log the fetched data
    res.status(200).json(slipHistory);
  } catch (error) {
    console.error('Error fetching slip history:', error.message); // Log any errors
    res.status(500).json({ message: error.message });
  }
};
