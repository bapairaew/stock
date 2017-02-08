const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: '__temp/' });
const router = new express.Router();

const { fromWorkbook } = require('../utils/products');
const { read, fillTemplate } = require('../utils/xlsx');
const { name, remove, writeBinary, temp, zip, cleanName } = require('../utils/file');
const { join, flatten } = require('../utils/array');
const { log } = require('../utils/log');
const { gen } = require('../utils/id');
const { classify, parseResults } = require('../utils/transformer');
const { isAuthenticated } = require('../utils/auth');
const { format } = require('../utils/date');

const Product = require('../models/Product');
const Buy = require('../models/Buy');
const Sell = require('../models/Sell');

router.get('/', isAuthenticated, (req, res) => {
  const { text, limit } = req.query;
  const query = Product.find({
    $or: [
      { id: { $regex: text, $options: 'i' } },
      { name: { $regex: text, $options: 'i' } },
      { model: { $regex: text, $options: 'i' } },
    ]});
  if (limit) {
    query.limit(+limit);
  }
  query.exec(function (err, results) {
      if (err) return res.status(500).send(log(err));
      res.status(200).json(results);
    });
});

const getSum = (id, _product) => {
  return Promise.all([
    Sell.find({ product: id }).lean(),
    Buy.find({ product: id }).lean(),
  ].concat(_product ? [] : [Product.findOne({ _id: id }).lean()]))
  .then(results => {
    const [ sell, buy, product = _product ] = results;
    return {
      product: product,
      sell: sell.reduce((sum, s) => sum + s.amount, 0),
      buy: buy.reduce((sum, b) => sum + b.amount, 0),
    };
  });
}

router.get('/sum', isAuthenticated, (req, res) => {
  const { text, limit } = req.query;
  const query = Product.find(text ? {
    $or: [
      { id: { $regex: text, $options: 'i' } },
      { name: { $regex: text, $options: 'i' } },
      { model: { $regex: text, $options: 'i' } },
    ]} : {})
    .lean();
  if (limit) {
    query.limit(+limit);
  }
  query.exec(function (err, results) {
      if (err) return res.status(500).send(log(err));
      Promise.all(results.map(r => getSum(r._id, r)))
        .then(r => res.status(200).json(r))
        .catch(err => res.status(500).send(log(err)));
    });
});

router.get('/sum/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  getSum(id)
    .then(r => res.status(200).json(r))
    .catch(err => res.status(500).send(log(err)));
});

router.get('/details/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  return Promise.all([
    Product.findOne({ _id: id }).lean(),
    Sell.find({ product: id }).lean(),
    Buy.find({ product: id }).lean(),
  ])
  .then(results => {
    const [ product, sell, buy ] = results;
    res.status(200).json({
      product: product,
      sell: sell,
      buy: buy,
    });
  });
});

const bringForwardId = 'ยอดยกมา';

const processTransactions = (transactions, product, startDate, endDate) => transactions.reduce((arr, b) => {
  if (b.receiptId === bringForwardId) {
    return arr;
  }

  if (b.date < startDate) {
    arr[0].amount += b.amount;
    return arr;
  } else if (b.date <= endDate) {
    return arr.concat(b);
  } else {
    return arr;
  }
}, [{ order: 1, date: startDate, receiptId: bringForwardId, product: product._id, amount: 0, price: null }]); // TODO: replace ยอดยกมา

const assignType = (item, type) => { item.type = type; return item; };

const combineTransaction = (buy, sell) => {
  return Object.assign({}, buy, { amount: buy.amount - sell.amount });
};

const makeReport = (req, res, products, year) => {
  const startDate = new Date(`${+year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${(+year + 1)}-01-01T00:00:00.000Z`);
  const files = [];
  Promise.all(products.map(product => {
    return Promise.all([
      Sell.find({ product: product._id }).lean(),
      Buy.find({ product: product._id }).lean(),
    ])
    .then(results => {
      const [ _sell, _buy ] = results;
      // filter out after endDate, sum before startDate
      // build json for templating
      const buy = processTransactions(_buy, product, startDate, endDate).map(b => assignType(b, 'buy'));
      const sell = processTransactions(_sell, product, startDate, endDate).map(s => assignType(s, 'sell'));

      if (buy.length === 1 && buy[0].amount === 0 &&
        sell.length === 1 && sell[0].amount === 0) {
        return;
      }

      let remaining = 0;
      const total = { buy: 0, sell: 0 };
      const report = {
        product: product,
        transactions: [combineTransaction(buy[0], sell[0])].concat(buy.slice(1).concat(sell.slice(1)))
          .sort((a, b) => a.date - b.date)
          .map(_t => {
            const t = Object.assign({}, _t);
            remaining = remaining + (t.type === 'buy' ? 1 : -1) * t.amount;
            t.date = format(t.date);
            t.remaining = remaining;
            t[t.type] = t.amount;
            total[t.type] += t.amount;
            return t;
          }),
        remaining: remaining,
        total: total,
        year: year,
      };

      // fill template
      const bytes = fillTemplate('report', report);

      // write to file
      const path = temp(product.id);
      writeBinary(path, bytes);   // TODO: async??

      // add path to files
      files.push(path);
    });
  }))
  .then(() => {
    // zip files
    const zipName = `${year}-${gen()}`;
    zip(temp(zipName), files.map(f => { return { path: f, name: cleanName(`${name(f)}.xlsx`) } }), (err) => {
      if (err) return res.status(500).send(log(err));
      // delete files
      files.forEach(f => remove(f));
      // stream back
      res.json({ url: `/api/v0/misc/download/${zipName}.zip` });
    });
  })
  .catch(err => {
    res.status(500).send(log(err));
  });
};

router.get('/report/:year', isAuthenticated, (req, res) => {
  const { year } = req.params;
  const { id } = req.query || {};

  if (id) {
    Product.findOne({ id: id })
      .lean()
      .exec(function (err, product) {
          if (err) return res.status(500).send(log(err));
          makeReport(req, res, [product], year);
      });
  } else {
    Product.find({})
      .lean()
      .exec(function (err, products) {
          if (err) return res.status(500).send(log(err));
          makeReport(req, res, products, year);
      });
  }
});

router.post('/save', isAuthenticated, (req, res) => {
  const { news, changes, removes } = classify(req.body);

  Promise.all(join(
    news.map(({ id, name, model }) => Product.create({ id, name, model })),
    changes.map(({ _id, id, name, model }) => Product.findOneAndUpdate({ _id }, { $set: { id, name, model } })),
    removes.map(({ _id }) => Product.findOneAndRemove({ _id }))
  ))
  .then(results => res.status(200).json(parseResults(results, { news, changes, removes })))
  .catch(err => res.status(500).send(log(err)));
});

router.post('/import', isAuthenticated, upload.single('file'), (req, res) => {
  const { path } = req.file;
  res.status(200).json({ rows: fromWorkbook(read(path)) });
  remove(path);
});

module.exports = router;
