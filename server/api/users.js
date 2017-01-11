const express = require('express');
const router = new express.Router();

const passport = require('passport');
const { isAuthenticated } = require('../utils/auth');

const User = require('../models/User');

const { log } = require('../utils/log');

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.status(200).send({ status: 'success' });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/register', isAuthenticated, (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, function (err) {
    if (err) return res.status(500).send(log(err));
    res.status(200).json({ status: 'success' });
  });
});

module.exports = router;
