const express = require('express');
const router = new express.Router();
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
      if (err) return res.status(500).send(err);
      res.status(200).json(results.filter(r => r.product));
    });
};

router.get('/sell', (req, res) => {
  search(Sell, req, res);
});

router.get('/buy', (req, res) => {
  search(Buy, req, res);
});

router.post('/sell/save', (req, res) => {
  setTimeout(() => {
    res.status(200).json({ status: 'done' });
  }, 300);
});

router.post('/buy/save', (req, res) => {
  setTimeout(() => {
    res.status(200).json({ status: 'done' });
  }, 300);
});

module.exports = router;
