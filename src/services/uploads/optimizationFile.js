const fs = require('fs');

const {
  dirStoreNames: { MAIN, OPTIMIZATION },
} = require('../../config');

if (!fs.existsSync(OPTIMIZATION)) fs.mkdirSync(OPTIMIZATION);

function sortArray(inputArray, defaultArray) {
  const sortedArray = defaultArray;

  for (const product of inputArray) {
    const { type, color, quantity, price, priceForPair } = product;

    const enabledProductIndex = sortedArray.findIndex(
      enabledProduct =>
        enabledProduct.type === type &&
        enabledProduct.color === color &&
        enabledProduct.price === price &&
        enabledProduct.priceForPair === priceForPair,
    );

    if (enabledProductIndex >= 0) {
      sortedArray[enabledProductIndex].quantity += parseInt(quantity, 10);
    } else {
      sortedArray.push({ ...product, quantity: Number(quantity) });
    }
  }

  return sortedArray;
}

async function optimizationFile(req) {
  const { filename } = req.params;
  const pathToOriginalFile = `${MAIN}/${filename}`;
  const pathToOptimizedFile = `${OPTIMIZATION}/${filename}`;

  if (!fs.existsSync(pathToOriginalFile)) throw new Error('No such file');
  const inputStream = fs.createReadStream(pathToOriginalFile);

  let sortedProductsArray = [];
  let stringRemnant = '';

  inputStream.on('data', chunk => {
    let productsString = chunk;
    if (Buffer.isBuffer(chunk)) productsString = chunk.toString('utf8');

    if (stringRemnant) stringRemnant += productsString.split('{', 1)[0];

    const productsStringJson =
      stringRemnant +
      productsString.slice(
        productsString.indexOf('{'),
        productsString.lastIndexOf('}') + 1,
      );

    const productsArrayJson = JSON.parse(`[${productsStringJson}]`);

    sortedProductsArray = sortArray(productsArrayJson, sortedProductsArray);

    stringRemnant = productsString.slice(productsString.lastIndexOf('},') + 2);
  });

  inputStream.on('end', () => {
    console.log('Successfully optimized array products');

    const totalQuantity = sortedProductsArray.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue.quantity;
      },
      0,
    );
    console.log('Total quantity products: ', totalQuantity);

    fs.writeFile(
      pathToOptimizedFile,
      JSON.stringify(sortedProductsArray, 0, '  '),
      () => {
        console.log(`File ${filename} has been overwritten`);
        fs.unlink(pathToOriginalFile, () => {
          console.log(`Previous version of file ${filename} has been deleted`);
        });
      },
    );
  });

  inputStream.on('error', err => console.log(err));
}

module.exports = optimizationFile;
