const express = require('express');
const router = new express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { join, flatten } = require('../utils/array');
const { log } = require('../utils/log');
const { classify, parseResults } = require('../utils/transformer');

const Product = require('../models/Product');
const Buy = require('../models/Buy');
const Sell = require('../models/Sell');

router.get('/', (req, res) => {
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

router.get('/details/:id', (req, res) => {
  const { id } = req.params;
  Promise.all([
    Product.find({ _id: id }),
    Sell.find({ product: { _id: id } }),
    Buy.find({ product: { _id: id } }),
  ])
  .then(results => {
    const [ product, sell, buy ] = results;
    res.status(200).json({
      product: product,
      sell: sell.reduce((sum, s) => sum + s.amount, 0),
      buy: buy.reduce((sum, b) => sum + b.amount, 0),
    });
  })
  .catch(err => res.status(500).send(log(err)));
});

router.post('/save', jsonParser, (req, res) => {
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
