const express = require('express');
const router = new express.Router();
const fs = require('fs');
const { generateFile } = require('../utils/xlsx');
const { isAuthenticated } = require('../utils/auth');
const { name, temp, remove } = require('../utils/file');
const { get } = require('../utils/obj');
const { log } = require('../utils/log');

const opt = (values, opt) => {
  const [ a, b ] = values;
  switch (opt) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    case 'date':
      return new Date(a);
    default:
      return null;
  }
};

const toArray = (rows, fields) => {
  if (!fields) {
    fields = Object.keys(rows[0]);
  }
  return rows.map(r => {
    return fields.map(f => {
      if (!f) {
        return null;
      } else if (typeof f === 'string') {
        return r[f];
      } else if (Array.isArray(f)) {
        return get(r, `.${f.join('.')}`);
      } else if (f.fields && f.opt) {
        return opt(f.fields.map(ff => r[ff]), f.opt);
      } else {
        return null;
      }
    });
  });
};

router.post('/export', isAuthenticated, (req, res) => {
  const { rows, params: { fields } } = req.body;
  res.json({ url: `/api/v0/misc/download/${generateFile(toArray(rows, fields))}.xlsx` });
});

const getId = filename => name(filename);

router.get('/download/:filename', isAuthenticated, (req, res) => {
  try {
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const { params: { filename } } = req;
    const filepath = temp(getId(filename));
    const file = fs.createReadStream(filepath);
    file.pipe(res)
      .on('close', () => remove(filepath))
      .on('error', err => log(err));
  } catch (ex) {
    res.status(500).send(log(ex));
  }
});

module.exports = router;
