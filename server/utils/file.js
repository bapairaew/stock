const settings = require('../../settings');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

exports.readFileSync = fs.readFileSync;
exports.temp = name => path.join(settings.temp, name);
exports.name = file => path.basename(file.replace(/\.[^/.]+$/, ''));
exports.remove = file => fs.unlink(file, () => {});
exports.writeBinary = (dst, bytes, cb) => fs.writeFileSync(dst, bytes, 'binary');
exports.zip = (dst, files, cb) => {
  const output = fs.createWriteStream(dst);
  const archive = archiver('zip', { store: true });
  output.on('close', () => cb());
  archive.on('error', cb);
  archive.pipe(output);
  files.forEach(f => archive.append(fs.createReadStream(f.path), { name: f.name }));
  archive.finalize();
};
exports.cleanName = name => name.replace(/([^a-z0-9]+)/gi, '_').substr(0, 200);
