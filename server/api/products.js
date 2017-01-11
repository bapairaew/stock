const express = require('express');
const router = new express.Router();

const { join, flatten } = require('../utils/array');
const { log } = require('../utils/log');
const { classify, parseResults } = require('../utils/transformer');
const { isAuthenticated } = require('../utils/auth');

const Product = require('../models/Product');
const Buy = require('../models/Buy');
const Sell = require('../models/Sell');

router.get('/', isAuthenticated, (req, res) => {
  const { text, limit } = req.query;
  Product.find({
    $or: [
      { id: { $regex: text, $options: 'i' } },
      { name: { $regex: text, $options: 'i' } },
      { model: { $regex: text, $options: 'i' } },
    ]},
    function (err, results) {
      if (err) return res.status(500).send(err);
      if (limit) results = results.slice(0, limit);
      res.status(200).json(results);
    });
});

const getDetails = (id) => {
  return Promise.all([
    Product.findOne({ _id: id }),
    Sell.find({ product: { _id: id } }),
    Buy.find({ product: { _id: id } }),
  ])
  .then(results => {
    const [ product, sell, buy ] = results;
    return {
      product: product,
      sell: sell.reduce((sum, s) => sum + s.amount, 0),
      buy: buy.reduce((sum, b) => sum + b.amount, 0),
    };
  });
}

router.get('/details', isAuthenticated, (req, res) => {
  const { text, limit } = req.query;
  Product.find({
    $or: [
      { id: { $regex: text, $options: 'i' } },
      { name: { $regex: text, $options: 'i' } },
      { model: { $regex: text, $options: 'i' } },
    ]},
    function (err, results) {
      if (err) return res.status(500).send(err);
      if (limit) results = results.slice(0, limit);
      Promise.all(results.map(r => getDetails(r._id)))
      .then(r => res.status(200).json(r))
      .catch(err => res.status(500).send(log(err)));
    });
});

router.get('/details/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  getDetails(id)
  .then(r => res.status(200).json(r))
  .catch(err => res.status(500).send(log(err)));
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

module.exports = router;
