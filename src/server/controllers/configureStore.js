const fs = require('fs');
const path = require('path');

const { store } = require('../../utils');

function setDataGlobal(req, res) {
  store.set(req.body);

  return res.status(200).json({ message: 'ok' });
}

function writeDataInFile(req, res) {
  fs.writeFileSync(
    path.resolve(process.cwd(), '/inputData.json'),
    JSON.stringify(req.body, 0, 2),
  );

  store.set(req.body);

  return res.status(200).json({ message: 'ok' });
}

module.exports = { setDataGlobal, writeDataInFile };
