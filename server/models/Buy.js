const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const BuySchema = new Schema({
  order         : Number,
  date          : { type: Date, index: true },
  receiptId     : { type: String, index: true },
  product       : { type: ObjectId, ref: 'Product', index: true },
  amount        : Number,
  price         : Number,
}, { timestamps: true, strict: true });

const Buy = mongoose.model('Buy', BuySchema);

module.exports = Buy;
