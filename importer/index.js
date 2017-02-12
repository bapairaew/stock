const { getSheet, toProducts, toTransactions, fillProduct } = require('./parser');

const products = toProducts(getSheet('./data/product.xlsx', 0), 4, { id: 'B', name: 'C', model: 'D' });
const buys = toTransactions(getSheet('./data/buy.xlsx', 0), 5, { order: 'A', date: 'B', receiptId: 'C', product: 'D', amount: 'G', price: 'K' });
const sells = toTransactions(getSheet('./data/sell.xlsx', 0), 5, { order: 'A', date: 'B', receiptId: 'C', product: 'D', amount: 'H', price: 'K' });

const Product = require('../server/models/Product');
const Buy = require('../server/models/Buy');
const Sell = require('../server/models/Sell');

console.log('Connecting to MongoDB…');
const mongoUrl = 'mongodb://localhost/stock';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, { server: { socketOptions: { connectTimeoutMS: MAX_TIMEOUT, socketTimeoutMS: MAX_TIMEOUT }}});
mongoose.connection.on('connected', function () {
  console.log('MongoDB connected.');

  console.log('Resetting database…');
  Promise.all([
    Product.remove({}),
    Buy.remove({}),
    Sell.remove({}),
  ])
  .then(() => {
    console.log('Adding product…');
    Product
      .insertMany(products)
      .then(products => {
        console.log(`Done: ${products.length}`);
        console.log('Adding transactions…');
        Promise.all([
          Buy.insertMany(fillProduct(buys, products)),
          Sell.insertMany(fillProduct(sells, products)),
        ])
        .then([ buys, sells ] => {
          console.log(`Done: buy: ${buys.length}, sell: ${sells.length}`);
          console.log('All done');
        })
        .catch(err => console.log(`Failed: ${err}`));
      })
      .catch(err => console.log(`Failed: ${err}`));
  })
  .catch(err => console.log(`Failed: ${err}`));
});
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
});
