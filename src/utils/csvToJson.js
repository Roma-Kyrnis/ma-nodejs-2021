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
        stringProductsWithoutRemnant = `${this.columnsHeaders}\n${this.remnant}${stringProductsWithoutRemnant}`; // ${this.columnsHeaders}\n
      }

      result += ',\n';
    } else {
      this.isNotFirst = true;
      [this.columnsHeaders] = stringProductsWithoutRemnant.split('\n', 1);
      stringProductsWithoutRemnant.split(
        stringProductsWithoutRemnant.indexOf('\n') + 1,
      );
      this.rowCount = 0;

      result += '[';
    }

    this.remnant = stringProducts.slice(stringProducts.lastIndexOf('\n') + 1);

    const addAllColumnsInProduct = arrayValuesProduct => {
      const arrayNamesColumns = this.columnsHeaders.split(',');

      const product = {};
      arrayValuesProduct.forEach((valueProduct, index) => {
        product[arrayNamesColumns[index]] = valueProduct;
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

    const parseOptions = {
      headers: false,
      renameHeaders: false,
      delimiter: ',',
      rowDelimiter: '\n',
      quoteHeaders: false,
      quoteColumns: false,
    };

    parseString(stringProductsWithoutRemnant, parseOptions)
      .on('error', error => console.error('on error csv', error))
      .on('data', rowProduct => {
        const fullProduct = addAllColumnsInProduct(rowProduct);

        result += `${JSON.stringify(fullProduct)},\n`;
      })
      .on('end', rowCount => {
        this.rowCount += rowCount;
        console.log(`Parsed ${rowCount} rows`);

        callback(null, result.slice(0, -2));
      });
  };

  const flush = callback => {
    console.log(`Parsed ${this.rowCount} rows at all!`);
    callback(null, `${this.remnant || ''}]`);
  };

  return Transform({ transform, flush });
}

module.exports = createCsvToJson;
