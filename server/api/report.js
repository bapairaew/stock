const express = require('express');
const router = new express.Router();

const { fillTemplate, makeCombinedTemplate, fillCombinedTemplate } = require('../utils/xlsx');
const { name, remove, writeBinary, temp, zip, cleanName } = require('../utils/file');
const { log } = require('../utils/log');
const { gen } = require('../utils/id');
const { isAuthenticated } = require('../utils/auth');
const { format, currentYear, startOfYear, endOfYear } = require('../utils/date');

const Product = require('../models/Product');
const Buy = require('../models/Buy');
const Sell = require('../models/Sell');

const bringForwardId = 'ยอดยกมา ';

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

const combineTransaction = (buy, sell) => Object.assign({}, buy, { amount: buy.amount - sell.amount });

const getFullReport = (_sell, _buy, product, year, startDate, endDate, timezone) => {
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
        t.date = format(t.date, timezone);
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

// TODO: `${(+year)}-12-31T16:59:59.999Z` is not universally good...
const getEndDate = (year, timezone) => year === currentYear() ? new Date() : endOfYear(year, timezone);
const makeDateRange = (year, timezone) => [ startOfYear(year, timezone), getEndDate(year, timezone) ];

const getReports = (products, year, startDate, endDate, timezone, removeTransactions) => {
  return Promise.all(products.map(product => {
    return Promise.all([
      Sell.find({ product: product._id }).lean(),
      Buy.find({ product: product._id }).lean(),
    ])
    .then(results => {
      const [ sell, buy ] = results;
      const productReport = getFullReport(sell, buy, product, year, startDate, endDate, timezone);

      if (removeTransactions && productReport) {
        delete productReport.transactions;   // would this improve performance??
      }

      return productReport;
    });
  }));
};

const makeSummaryReport = (req, res, products, year, timezone) => {
  const [ startDate, endDate ] = makeDateRange(year, timezone);
  getReports(products, year, startDate, endDate, timezone, true)
  .then(products => {
    const report = {
      products: products.filter(p => p).sort((p1, p2) => p1.product.id.localeCompare(p2.product.id)),
      date: format(endDate, timezone),
      sumOfBuy: products.reduce((sum, product) => sum + (product && product.total.buy || 0), 0),
      sumOfSell: products.reduce((sum, product) => sum + (product && product.total.sell || 0), 0),
    };
    report.sumOfRemaining = report.sumOfBuy - report.sumOfSell;
    report.products.forEach((p, index) => { p.index = index + 1; });
    const bytes = fillTemplate('summary', report);
    const name = cleanName(`summary-${year}-${gen()}`);
    const file = temp(name);
    writeBinary(file, bytes);
    res.status(200).json({ url: `/api/v0/misc/download/${name}.xlsx` });
  })
  .catch(err => {
    res.status(500).send(log(err));
  });
};

const zipReports = (res, files, year) => {
  const zipName = `report-${year}-${gen()}`;

  zip(temp(zipName), files, (err) => {
    if (err) return res.status(500).send(log(err));
    files.forEach(f => remove(f.path));
    res.status(200).json({ url: `/api/v0/misc/download/${zipName}.zip` });
  });
};

const makeFullReport = (req, res, products, year, timezone) => {
  const [ startDate, endDate ] = makeDateRange(year, timezone);
  getReports(products, year, startDate, endDate, timezone)
  .then(_reports => {
    const reports = _reports.filter(f => f);

    const files = reports.map(report => {
      const bytes = fillTemplate('report', report);
      const file = temp(cleanName(`${product.id}-${gen()}`));
      writeBinary(file, bytes);
      return { path: file, name: `${name(file)}.xlsx` };
    });

    zipReports(res, files, year);
  })
  .catch(err => {
    res.status(500).send(log(err));
  });
};

const makeCombinedFullReport = (req, res, products, year, timezone) => {
  const [ startDate, endDate ] = makeDateRange(year, timezone);
  getReports(products, year, startDate, endDate, timezone)
  .then(completedReports => {
    const reports = completedReports.filter(r => r).map((report, index) => {
      report.index = index + 1;
      report.name = cleanName(report.product.id);
      // TODO: THIS IS WORKAROUND for xlsx-template generate same 'string' value as the first sheet in all other worksheets
      report.productId = [report.product.id];
      report.productName = [report.product.name];
      report.productModel = [report.product.model];
      return report;
    });
    const chunkSize = 2000;
    const strategies = makeCombinedTemplate('report', reports, chunkSize);
    const files = strategies.map((strategy, index) => {
      const { path, reports } = strategy;
      const bytes = fillCombinedTemplate(path, reports);
      remove(path);
      const resultPath = temp(gen());
      writeBinary(resultPath, bytes);
      return { path: resultPath, name: `report-${index}.xlsx` };
    });
    zipReports(res, files, year);
  })
  .catch(err => {
    res.status(500).send(log(err));
  });
};

const makeReport = (req, res, maker) => {
  const { year } = req.params;
  // TODO: use timezone
  const { id, timezone } = req.query || {};

  if (id) {
    Product.findOne({ id: id })
      .lean()
      .exec(function (err, product) {
          if (err) return res.status(500).send(log(err));
          maker(req, res, [product], year, timezone);
      });
  } else {
    Product.find({})
      .lean()
      .exec(function (err, products) {
          if (err) return res.status(500).send(log(err));
          maker(req, res, products, year, timezone);
      });
  }
};

router.get('/summary/:year', isAuthenticated, (req, res) => {
  makeReport(req, res, makeSummaryReport);
});

router.get('/full/:year', isAuthenticated, (req, res) => {
  makeReport(req, res, makeCombinedFullReport);
});

module.exports = router;
