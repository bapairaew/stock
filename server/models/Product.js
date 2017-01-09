const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  id           : { type: String, index: true },
  name         : { type: String, index: true },
  model        : { type: String, index: true },
}, { timestamps: true, strict: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
