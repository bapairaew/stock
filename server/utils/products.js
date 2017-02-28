const Product = require('../models/Product');

const DefaultModel = 'HONDA';

exports.populate = function (arr, addIfNotExisted = true) {
  // TODO: optimise this
  const newProducts = [];
  return new Promise(function (resolve, reject) {
    Promise.all(arr.map(r =>
      Product.findOne({ id: r.product })
        .lean()
        .then(p => {
          if (addIfNotExisted && !p) {
            newProducts.push({ id: r.product, name: r.productName, model: DefaultModel });
          }
          return Object.assign({}, r, { product: p || r.product });
        })))
        .then(results => {
          if (newProducts.length === 0) {
            resolve({ rows: results, newProducts: [] });
          } else {
            Promise.all(newProducts.map(product => Product.create(product)))
              .then(products => {
                const filledResults = results.map(result => {
                  if (result.product && !result.product._id) {
                    const match = products.find(product => product.id === result.product);
                    return Object.assign({}, result, { product: match });
                  } else {
                    return result;
                  }
                });

                resolve({ rows: filledResults, newProducts: products });
              })
              .catch(err => reject(err));
          }
        })
        .catch(err => reject(err));
  });
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
