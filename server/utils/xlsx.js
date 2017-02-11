const XLSX = require('xlsx-style');
const { temp, readFileSync } = require('../utils/file');
const { gen } = require('../utils/id');
const { format } = require('../utils/date');
const { chunk } = require('../utils/array');
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

exports.read = _path => XLSX.readFile(_path);

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

exports.fillCombinedTemplate = function (templatePath, items) {
	const data = readFileSync(templatePath, 'binary');
	const template = new XlsxTemplate(data);
	items.forEach(item => { template.substitute(item.name, item); });

	return template.generate();
};

exports.makeCombinedTemplate = function (name, fullReports, chunkSize) {
	const templatePath = path.join(__dirname, '..', 'templates', `${name}.xlsx`);
  const templateWorkbook = XLSX.readFile(templatePath, { cellStyles: true });
	const templateSheet = templateWorkbook.Sheets[templateWorkbook.SheetNames[0]];
	const reportsChunk = chunk(fullReports, chunkSize);
	return reportsChunk.map(reports => {
		const id = gen();
		const sheets = {};
		reports.forEach(report => { sheets[report.name] = templateSheet; });
		const path = temp(id);
	  XLSX.writeFile({
	    SheetNames: reports.map(r => r.name),
	    Sheets: sheets,
		},
		path, { bookSST: true });

		return {
			reports: reports,
			path: path
		};
	});
};

exports.print = function (value) {
	if (value instanceof Date) {
		return format(value);
	}

	return value;
};
