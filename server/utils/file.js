const settings = require('../../settings');
const path = require('path');
const fs = require('fs');

exports.temp = name => path.join(settings.temp, name);
exports.name = file => file.replace(/\.[^/.]+$/, '');
exports.remove = file => fs.unlink(file, () => {});
