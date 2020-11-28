const { pipeline } = require('stream');
const fs = require('fs');

const {
  dirStoreNames: { MAIN, OPTIMIZATION },
} = require('../config');

if (!fs.existsSync(OPTIMIZATION)) fs.mkdirSync(OPTIMIZATION);

function optimizationFiles(req) {
  const { url } = req;
  const nameFile = url.pathname.slice(url.pathname.lastIndexOf('/') + 1);
  const inputStream = fs.createReadStream(MAIN + nameFile);

  const outputStream = fs.createWriteStream(OPTIMIZATION);

  pipeline(inputStream, , outputStream);
}

module.exports = optimizationFiles;
