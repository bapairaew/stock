const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: '__temp/' });
const router = new express.Router();

const { populate } = require('../utils/products');
const { fromWorkbook } = require('../utils/stock');
const { read } = require('../utils/xlsx');
const { name, remove } = require('../utils/file');
const { join } = require('../utils/array');
const { log } = require('../utils/log');
const { classify, parseResults } = require('../utils/transformer');
const { isAuthenticated } = require('../utils/auth');

const Sell = require('../models/Sell');
const Buy = require('../models/Buy');
const Product = require('../models/Product');

// Optimise this
const search = (Model, req, res) => {
  const { startDate, receiptId, endDate, text } = req.query;
  const query = Model
    .find({ date: { $gt: new Date(startDate), $lt: new Date(endDate) },  receiptId: { $regex: receiptId, $options: 'i' } })
    .populate('product', null, {
      $or: [
        { id: { $regex: text, $options: 'i' } },
        { name: { $regex: text, $options: 'i' } },
        { model: { $regex: text, $options: 'i' } },
      ]})
    .lean()
    .sort({ date: 1, receiptId: 1, order: 1 })
    .exec(function (err, results) {
      if (err) return res.status(500).send(log(err));
      res.status(200).json(results);
    });
};

router.get('/sell', isAuthenticated, (req, res) => {
  search(Sell, req, res);
});

router.get('/buy', isAuthenticated, (req, res) => {
  search(Buy, req, res);
});

const parseProps = ({ date, product, order, receiptId, amount, price }) => {
  return {
    date: new Date(date),
    product: product && product._id || null,
    order,
    receiptId,
    amount,
    price,
  };
};

const saveAll = (Model, rows, res) => {
  const { adds, changes, removes } = classify(rows);

  return Promise.all(join(
    adds.map(props => Model.create(parseProps(props))),
    changes.map(props => Model.findOneAndUpdate({ _id: props._id }, { $set: parseProps(props) })),
    removes.map(({ _id }) => Model.findOneAndRemove({ _id }))
  ))
  .then(results => res.status(200).json(parseResults(results, { adds, changes, removes })))
  .catch(err => res.status(500).send(log(err)));
};

router.post('/sell/save', isAuthenticated, (req, res) => {
  saveAll(Sell, req.body, res);
});

router.post('/buy/save', isAuthenticated, (req, res) => {
  saveAll(Buy, req.body, res);
});

const _import = (req, res) => {
  const { path, originalname } = req.file;
  populate(fromWorkbook(read(path)))
    .then(results => res.status(200).json({ rows: results.rows, extras: { newProducts: results.newProducts, receiptId: name(originalname) }}))
    .catch(err => res.status(500).json(log({ error: err })));
  remove(path);
};

router.post('/sell/import', isAuthenticated, upload.single('file'), _import);
router.post('/buy/import', isAuthenticated, upload.single('file'), _import);

module.exports = router;
