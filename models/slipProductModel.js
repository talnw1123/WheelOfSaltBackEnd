const mongoose = require('mongoose');

const slipProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  information: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const SlipProduct = mongoose.model('SlipProduct', slipProductSchema);

module.exports = SlipProduct;
