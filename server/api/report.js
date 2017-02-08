const express = require('express');
const router = new express.Router();

const { fillTemplate } = require('../utils/xlsx');
const { name, remove, writeBinary, temp, zip, cleanName } = require('../utils/file');
const { log } = require('../utils/log');
const { gen } = require('../utils/id');
const { isAuthenticated } = require('../utils/auth');
const { format } = require('../utils/date');

const Product = require('../models/Product');
const Buy = require('../models/Buy');
const Sell = require('../models/Sell');

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

const getFullReport = (_sell, _buy, product, year, startDate, endDate) => {
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
  return {
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
};

const makeDateRange = year => [ new Date(`${+year}-01-01T00:00:00.000Z`), new Date(`${(+year + 1)}-01-01T00:00:00.000Z`) ];

const makeSummaryReport = (req, res, products, year) => {
  const [ startDate, endDate ] = makeDateRange(year);
  Promise.all(products.map(product => {
    return Promise.all([
      Sell.find({ product: product._id }).lean(),
      Buy.find({ product: product._id }).lean(),
    ])
    .then(results => {
      const [ sell, buy ] = results;
      const report = getFullReport(sell, buy, product, year, startDate, endDate);
      delete report.transactions;   // would this improve performance??
      return report;
    });
  }))
  .then(reports => {
    // TODO:
    console.log(reports);
    res.status(200).json(reports);
  })
  .catch(err => {
    res.status(500).send(log(err));
  });
};

const makeFullReport = (req, res, products, year) => {
  const [ startDate, endDate ] = makeDateRange(year);
  // const files = [];
  Promise.all(products.map(product => {
    return Promise.all([
      Sell.find({ product: product._id }).lean(),
      Buy.find({ product: product._id }).lean(),
    ])
    .then(results => {
      const [ sell, buy ] = results;
      const report = getFullReport(sell, buy, product, year, startDate, endDate);

      // fill template
      const bytes = fillTemplate('report', report);

      // write to file
      const file = temp(cleanName(`${product.id}-${gen()}`));
      writeBinary(file, bytes);

      // // add path to files
      // files.push(file);
      return file;
    });
  }))
  .then(files => {
    // zip files
    const zipName = `${year}-${gen()}`;
    zip(temp(zipName), files.map(f => { return { path: f, name: `${name(f)}.xlsx` } }), (err) => {
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

const makeReport = (req, res, maker) => {
  const { year } = req.params;
  const { id } = req.query || {};

  if (id) {
    Product.findOne({ id: id })
      .lean()
      .exec(function (err, product) {
          if (err) return res.status(500).send(log(err));
          maker(req, res, [product], year);
      });
  } else {
    Product.find({})
      .lean()
      .exec(function (err, products) {
          if (err) return res.status(500).send(log(err));
          maker(req, res, products, year);
      });
  }
};

router.get('/summary/:year', isAuthenticated, (req, res) => {
  makeReport(req, res, makeSummaryReport);
});

router.get('/full/:year', isAuthenticated, (req, res) => {
  makeReport(req, res, makeFullReport);
});

module.exports = router;
