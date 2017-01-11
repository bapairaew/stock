const express = require('express');
const router = new express.Router();
const multer  = require('multer');
const upload = multer({ dest: '__temp/' });
const path = require('path');
const fs = require('fs');
const XLSX = require('XLSX');
const settings = require('../../settings');
const { sheetFromArray } = require('../utils/xlsxHelper');
const { isAuthenticated } = require('../utils/auth');

const generateFile = () => {
  const id = Math.floor(Math.random() * 100000000000) + '';
  XLSX.writeFile({
      SheetNames: ['Sheet 1'],
      Sheets: { 'Sheet 1': sheetFromArray([['Hello World!']]) },
    },
    getExportPath(id));
  return id;
};

const getExportPath = (id) => path.join(settings.temp, id);

router.post('/export', isAuthenticated, (req, res) => {
  setTimeout(() => {
    res.json({ url: `/api/v0/stock/download/${generateFile()}.xlsx` });
  }, 5000);
});

router.post('/import', isAuthenticated, upload.single('file'), (req, res) => {
  setTimeout(() => {
    res.status(200).json([{}]);
  }, 5000);
});

const getId = (filename) => path.basename(filename, '.xlsx');

router.get('/download/:filename', isAuthenticated, (req, res) => {
  try {
    const { params: { filename } } = req;
    const filepath = getExportPath(getId(filename));
    const file = fs.createReadStream(filepath);
    file.on('end', function() {
      fs.unlink(filepath, () => {});
    });
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    file.pipe(res);
  } catch (ex) {
    res.status(500).send(ex);
  }
});

module.exports = router;
