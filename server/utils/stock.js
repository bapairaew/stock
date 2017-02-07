const startRow = 2;
exports.fromWorkbook = function (workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const results = [];
  let index = startRow;
  while (sheet[`A${index}`]) {
    results.push({
      order: +sheet[`A${index}`].v,
      product: sheet[`B${index}`].v,
      amount: +sheet[`D${index}`].v,
      price: +sheet[`E${index}`].v
    });
    index++;
  }
  return results;
};
