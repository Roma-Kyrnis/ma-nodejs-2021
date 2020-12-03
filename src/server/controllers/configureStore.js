const fs = require('fs');
const path = require('path');

const { store } = require('../../utils');

function isIncorrectData(data) {
  if (!Array.isArray(data) || data.length === 0) return true;

  const incorrectArray = data.filter(
    value =>
      !(value.color && value.type && (value.price || value.priceForPair)),
  );
  if (incorrectArray.length !== 0) return true;

  return false;
}

function setDataGlobal(req, res) {
  const { body: data } = req;

  if (isIncorrectData(data)) {
    return res.status(400).json({ message: 'Incorrect data!' });
  }

  store.set(data);

  return res.status(200).json({ message: 'ok' });
}

function writeDataInFile(req, res) {
  const { body: data } = req;

  if (isIncorrectData(data)) {
    return res.status(400).json({ message: 'Incorrect data!' });
  }

  fs.writeFileSync(
    path.resolve(process.cwd(), '/inputData.json'),
    JSON.stringify(data, 0, 2),
  );

  store.set(data);

  return res.status(200).json({ message: 'ok' });
}

module.exports = { setDataGlobal, writeDataInFile };
