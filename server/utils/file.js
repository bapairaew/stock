const settings = require('../../settings');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

exports.temp = name => path.join(settings.temp, name);
exports.name = file => file.replace(/\.[^/.]+$/, '');
exports.remove = file => fs.unlink(file, () => {});
exports.writeBinary = (dst, bytes, cb) => fs.writeFileSync(dst, bytes, 'binary');
exports.zip = (dst, files) => {
  var zip = new AdmZip();
  files.forEach(f => zip.addLocalFile(f));
  zip.writeZip(dst);
};
