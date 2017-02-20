const { getSheet, toProducts, toTransactions, fillProduct } = require('./parser');

const products = toProducts(getSheet('./importer/data/product.xlsx', 0), 4, { id: 'B', name: 'C', model: 'D' });
const buys = toTransactions(getSheet('./importer/data/buy.xlsx', 0), 4, { order: 'A', date: 'B', receiptId: 'C', product: 'D', amount: 'G', price: 'K' });
const sells = toTransactions(getSheet('./importer/data/sell.xlsx', 0), 4, { order: 'A', date: 'B', receiptId: 'C', product: 'D', amount: 'H', price: 'K' });

const Product = require('../server/models/Product');
const Buy = require('../server/models/Buy');
const Sell = require('../server/models/Sell');

console.log('Connecting to MongoDB…');
const mongoUrl = 'mongodb://localhost/stock';
const mongoose = require('mongoose');
const MAX_TIMEOUT =  12 * 60 * 60 * 1000;
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
        .then(response => {
          const [ buys, sells ] = response;
          console.log(`Done: buy: ${buys.length}, sell: ${sells.length}`);
          console.log('All done');
          process.exit(-1); // eslint-disable-line no-process-exit
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
