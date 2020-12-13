const { Transform, Writable } = require('stream');

const { products } = require('../db');

function createTransformStreamToDB() {
  let isNotFirst = false;
  let columnsHeaders = [];
  let rowCount = 0;

  const transform = (chunk, encoding, callback) => {
    let result = '';

    const stringProduct = chunk.toString('utf8');
    if (columnsHeaders.toString() === stringProduct) return callback();

    const arrayProduct = stringProduct.split(',');

    const addAllColumnsInProduct = arrayValuesProduct => {
      const product = {};
      arrayValuesProduct.forEach((valueProduct, index) => {
        product[columnsHeaders[index]] = valueProduct;
      });

      const fullProduct = {
        type: product.type,
        color: product.color,
        quantity: product.quantity,
      };

      if (product.isPair === 'true') fullProduct.priceForPair = product.price;
      else fullProduct.price = product.price;

      return fullProduct;
    };

    if (isNotFirst) {
      rowCount += 1;

      const product = addAllColumnsInProduct(arrayProduct);
      result += `${JSON.stringify(product)}`;
    } else {
      isNotFirst = true;
      columnsHeaders = arrayProduct;
    }

    return callback(null, result);
  };

  const flush = callback => {
    console.log(`Parsed ${rowCount} rows at all!`);
    callback();
  };

  return new Transform({ transform, flush });
}

function createWriteStreamToDB() {
  const write = async (chunk, encoding, callback) => {
    const product = JSON.parse(chunk.toString());

    products.createProduct(product);
    callback();
  };

  return Writable({ write });
}

module.exports = { createTransformStreamToDB, createWriteStreamToDB };
