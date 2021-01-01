const { Transform, Writable } = require('stream');

function createTransformStreamToDB() {
  let isNotFirst = false;
  let columnHeaders = [];

  const transform = (chunk, encoding, callback) => {
    let result = '';

    const stringProduct = chunk.toString('utf8');
    if (columnHeaders.toString() === stringProduct) return callback();

    const getFullProduct = items => ({
      type: items[columnHeaders.indexOf('type')],
      color: items[columnHeaders.indexOf('color')],
      quantity: items[columnHeaders.indexOf('quantity')],
      price: items[columnHeaders.indexOf('price')],
    });

    if (isNotFirst) {
      const product = getFullProduct(stringProduct.split(','));
      result += `${JSON.stringify(product)}`;
    } else {
      isNotFirst = true;
      columnHeaders = stringProduct.split(',');
    }

    return callback(null, result);
  };

  return new Transform({ transform });
}

function createWriteStreamToDB(writeToDB) {
  const write = (chunk, encoding, callback) => {
    const product = JSON.parse(chunk.toString());

    writeToDB(product).catch(err => console.error(err));

    callback();
  };

  return Writable({ write });
}

module.exports = { createTransformStreamToDB, createWriteStreamToDB };
