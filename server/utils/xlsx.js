const XLSX = require('XLSX');
const { temp, readFileSync } = require('../utils/file');
const { gen } = require('../utils/id');
const XlsxTemplate = require('xlsx-template');
const path = require('path');

// view-source:http://sheetjs.com/demos/writexlsx.html
function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

// view-source:http://sheetjs.com/demos/writexlsx.html
function fromArray(data) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
};

exports.generateFile = function (data) {
  const id = gen();
  XLSX.writeFile({
      SheetNames: ['Sheet 1'],
      Sheets: { 'Sheet 1': fromArray(data) },
    },
    temp(id));
  return id;
};

exports.read = function (path) {
	return XLSX.readFile(path);
};

exports.fillTemplate = function (name, obj) {
	const templatePath = path.join(__dirname, '..', 'templates', `${name}.xlsx`);
	const data = readFileSync(templatePath);
	// Create a template
	const template = new XlsxTemplate(data);
	const sheetNumber = 1;
	// Perform substitution
	template.substitute(sheetNumber, obj);
	// Get binary data
	return template.generate();
};
