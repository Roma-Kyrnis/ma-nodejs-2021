const { Transform } = require('stream');

function createCsvToJson() {
  let isNotFirst = false;
  let insertLineSeparator = false;
  let columnsHeaders = [];
  let rowCount = 0;

  const transform = (chunk, encoding, callback) => {
    let result = '';

    const stringProduct = chunk.toString('utf8');
    if (columnsHeaders.toString() === stringProduct) return callback(null, '');

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

      if (insertLineSeparator) result += ',\n';
      else insertLineSeparator = true;

      const product = addAllColumnsInProduct(arrayProduct);
      result += `${JSON.stringify(product)}`;
    } else {
      result += '[';
      isNotFirst = true;
      columnsHeaders = arrayProduct;
    }

    return callback(null, result);
  };

  const flush = callback => {
    console.log(`Parsed ${rowCount} rows at all!`);
    callback(null, ']');
  };

  return new Transform({ transform, flush });
}

module.exports = createCsvToJson;
