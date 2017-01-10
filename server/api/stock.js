const express = require('express');
const router = new express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { join } = require('../utils/array');
const { log } = require('../utils/log');
const { classify, parseResults } = require('../utils/transformer');

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
    .exec(function (err, results) {
      if (err) return res.status(500).send(log(err));
      res.status(200).json(results.filter(r => r.product));
    });
};

router.get('/sell', (req, res) => {
  search(Sell, req, res);
});

router.get('/buy', (req, res) => {
  search(Buy, req, res);
});

const parseProps = ({ date, product, order, receiptId, amount, price }) => {
  return {
    date: new Date(date),
    product: product._id,
    order,
    receiptId,
    amount,
    price,
  };
};

const saveAll = (Model, rows, res) => {
  const { news, changes, removes } = classify(rows);

  return Promise.all(join(
    news.map(props => Model.create(parseProps(props))),
    changes.map(props => Model.findOneAndUpdate({ _id: props._id }, { $set: parseProps(props) })),
    removes.map(({ _id }) => Model.findOneAndRemove({ _id }))
  ))
  .then(results => res.status(200).json(parseResults(results, { news, changes, removes })))
  .catch(err => res.status(500).send(log(err)));
};

router.post('/sell/save', jsonParser, (req, res) => {
  saveAll(Sell, req.body, res);
});

router.post('/buy/save', jsonParser, (req, res) => {
  saveAll(Buy, req.body, res);
});

module.exports = router;
