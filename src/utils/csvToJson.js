/* eslint-disable no-useless-return */
const { Transform } = require('stream');

const { parseString } = require('fast-csv');

function createCsvToJson() {
  const transform = (chunk, encoding, callback) => {
    let result = '';

    const stringProducts = chunk.toString('utf8');
    let stringProductsWithoutRemnant = stringProducts.slice(
      0,
      stringProducts.lastIndexOf('\n'),
    );

    if (this.isNotFirst) {
      if (this.remnant) {
        stringProductsWithoutRemnant = `${this.columnsNames}\n${this.remnant}${stringProductsWithoutRemnant}`;
      }

      result += ',\n';
    } else {
      this.isNotFirst = true;
      this.columnsNames = stringProductsWithoutRemnant.split('\n', 1);

      result += '[';
    }

    this.remnant = stringProducts.slice(stringProducts.lastIndexOf('\n') + 1);

    const parseOptions = {
      headers: true,
      renameHeaders: false,
      delimiter: ',',
      rowDelimiter: '\n',
      quoteHeaders: false,
      quoteColumns: false,
    };

    const addAllColumnsInProduct = rowProduct => {
      const { type, color, quantity, price, isPair } = rowProduct;
      const fullProduct = { type, color, quantity: quantity || 0 };

      if (isPair === 'true') fullProduct.priceForPair = price;
      else fullProduct.price = price;

      return fullProduct;
    };

    parseString(stringProductsWithoutRemnant, parseOptions)
      .on('error', error => console.error('on error csv', error))
      .on('data', rowProduct => {
        const fullProduct = addAllColumnsInProduct(rowProduct);

        result += `${JSON.stringify(fullProduct)},\n`;
      })
      .on('end', rowCount => {
        console.log(`Parsed ${rowCount} rows`);

        callback(null, result.slice(0, -2));
      });
  };

  const flush = callback => {
    callback(null, `${this.remnant || ''}]`);
  };

  return Transform({ transform, flush });
}

module.exports = createCsvToJson;
