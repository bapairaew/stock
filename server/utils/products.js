const Product = require('../models/Product');

exports.populate = function (arr) {
  // TODO: optimise this
  return Promise.all(arr.map(r => Product.findOne({ id: r.product }).lean().then(p => Object.assign({}, r, { product: p }))));
};

const startRow = 2;
exports.fromWorkbook = function (workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const results = [];
  let index = startRow;
  while (sheet[`A${index}`]) {
    results.push({
      id: sheet[`A${index}`].v,
      name: sheet[`B${index}`].v,
      model: sheet[`C${index}`].v,
    });
    index++;
  }
  return results;
};
