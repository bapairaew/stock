const { read } = require('../server/utils/xlsx');

exports.getSheet = (path, index) => {
  console.log(`Reading ${path}…`);
  const workbook = read(path);
  console.log(`Parsing as ${path}…`);
  const sheet = workbook.Sheets[workbook.SheetNames[index]];
  return sheet;
};

exports.toProducts = (sheet, startRow, { id, name, model }) => {
  console.log(`Parsing products…`);
  const products = [];
  let row = startRow;
  while (sheet[id + row]) {
    const product = {
      id: sheet[id + row].w,
      name: sheet[name + row].w,
      model: sheet[model + row].w,
    };
    products.push(product);
    row++;
  }
  console.log(`Done: ${products.length}`);
  return products;
};

exports.toTransactions = (sheet, startRow, { order, date, receiptId, product, amount, price }) => {
  console.log(`Parsing transactions…`);
  const transactions = [];
  let row = startRow;
  while (sheet[order + row] || sheet[order + row] === 0) {
    const s = {
      order: +sheet[order + row].v,
      date: date(+sheet[date + row].v),
      receiptId: sheet[receiptId + row].v,
      product: sheet[product + row].v,
      amount: +sheet[amount + row].v,
      price: (sheet[price + row] && +sheet[price + row].v) || 0,
    };
    transactions.push(s);
    row++;
  }
  console.log(`Done: ${transactions.length}`);
  return transactions;
};

const findById = (id, products) => {
  const match = products.find(product => product._id === id);
  return match ? match._id : null;
};

exports.fillProduct = (transactions, products) => {
  return transactions.map(transaction => Object.assign({}, transaction, { product: findById(transaction, products) }));
};
