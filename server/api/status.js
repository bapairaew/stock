const express = require('express');
const router = new express.Router();

const Product = require('../models/Product');

router.get('/server', (req, res) => {
  res.status(200).json({ status: 'online' });
});

router.get('/database', (req, res) => {
  Product.find({}).limit(1).lean()
    .then(() => res.status(200).json({ status: 'online' }))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
