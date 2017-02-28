const { getSheet, toProducts, toTransactions, fillProduct } = require('./parser');

const products = toProducts(getSheet('../import-data/product.xlsx', 0), 4, { id: 'B', name: 'C', model: 'D' });
const buys = toTransactions(getSheet('../import-data/buy.xlsx', 0), 4, { order: 'A', date: 'B', receiptId: 'C', product: 'D', productName: 'E', productModel: 'F', amount: 'G', price: 'K' });
const sells = toTransactions(getSheet('../import-data/sell.xlsx', 0), 4, { order: 'A', date: 'B', receiptId: 'C', product: 'D', productName: 'E', productModel: 'F', amount: 'H', price: 'K' });

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
    const before = products.length;
    console.log('Adding no matched products from transactions…');
    const addToProductIfNotMatched = t => {
      if (!products.find(p => p.id === t.product)) {
        products.push({ id: t.product, name: t.productModel, model: t.productModel });
      }
    };
    buys.forEach(addToProductIfNotMatched);
    sells.forEach(addToProductIfNotMatched);
    console.log(`Done: ${products.length - before} new`);

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
