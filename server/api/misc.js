const express = require('express');
const router = new express.Router();
const fs = require('fs');
const { generateFile, print } = require('../utils/xlsx');
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
  return rows.map(row => {
    return fields.map(field => {
      let value = null;

      if (field) {
        if (typeof field === 'string') {
          value = row[field];
        } else if (Array.isArray(field)) {
          value = get(row, `.${field.join('.')}`);
        } else if (field.fields && field.opt) {
          value = opt(field.fields.map(ff => row[ff]), field.opt);
        }
      }

      return print(value);
    });
  });
};

router.post('/export', isAuthenticated, (req, res) => {
  const { rows, params: { fields } } = req.body;
  res.json({ url: `/api/v0/misc/download/${generateFile(toArray(rows, fields))}.xlsx` });
});

router.get('/download/:filename', isAuthenticated, (req, res) => {
  try {
    // res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const { params: { filename } } = req;
    const filepath = temp(name(filename));
    const file = fs.createReadStream(filepath);
    file.pipe(res)
      .on('end', () => remove(filepath))
      .on('error', err => log(err));
  } catch (ex) {
    res.status(500).send(log(ex));
  }
});

module.exports = router;
