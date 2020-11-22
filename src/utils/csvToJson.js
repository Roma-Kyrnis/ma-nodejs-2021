/* eslint-disable no-useless-return */
const { Transform } = require('stream');

const csv = require('fast-csv');

function convertStringToJsonString(text, isFirst) {
  const result = { text: '', remnant: '' };

  const arrayStings = text.split('\n');

  let arrayNameFields = [];
  arrayStings.forEach((string, index) => {
    const arrayValues = string.split(',');

    if (index === 0 && isFirst) {
      arrayNameFields = arrayValues;
      return;
    }

    const product = {};

    arrayNameFields.forEach(fieldName => {
      
    })
  });

  return result;
}

function createCsvToJson() {
  const transform = (chunk, encoding, callback) => {
    let result = '';

    if (!this.isNotFirst) {
      this.isNotFirst = true;

      result += '[';
    }

    let text;
    if (Buffer.isBuffer(chunk)) text += chunk.toString();

    const objectWithTextAndRemnant = convertStringToJsonString(
      text,
      !this.isNotFirst,
    );

    result += objectWithTextAndRemnant.text;
    this.remnant = objectWithTextAndRemnant.remnant;

    callback(null, result);
  };

  const flush = callback => {
    callback(null, ']');
  };

  csv.parse({ headers: true });
  return Transform({ transform, flush });
}

module.exports = createCsvToJson;
