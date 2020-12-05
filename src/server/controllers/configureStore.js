const fs = require('fs');
const path = require('path');

const { store, httpResponses } = require('../../utils');

function isIncorrectData(data) {
  if (!Array.isArray(data) || data.length === 0) return true;

  const incorrectArray = data.filter(
    value =>
      !(value.color && value.type && (value.price || value.priceForPair)),
  );
  if (incorrectArray.length !== 0) return true;

  return false;
}

function setDataGlobal(request, response) {
  const { method, body: data } = request;

  if (method !== 'POST') return httpResponses.methodNotAllowed(response);
  if (isIncorrectData(data)) {
    return httpResponses.badRequest(response, { message: 'Incorrect data!' });
  }

  store.set(data);

  return httpResponses.ok(response);
}

function writeDataInFile(request, response) {
  const { method, body: data } = request;

  if (method !== 'POST') return httpResponses.methodNotAllowed(response);
  if (isIncorrectData(data)) {
    return httpResponses.badRequest(response, { message: 'Incorrect data!' });
  }

  fs.writeFileSync(
    path.resolve(__dirname, 'inputData.json'),
    JSON.stringify(data, 0, 2),
  );

  store.set(data);

  return httpResponses.ok(response);
}

module.exports = { setDataGlobal, writeDataInFile };
