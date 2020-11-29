const fs = require('fs');

const {
  dirStoreNames: { MAIN, OPTIMIZATION },
} = require('../config');

if (!fs.existsSync(OPTIMIZATION)) fs.mkdirSync(OPTIMIZATION);

function sortArray(inputArray, defaultArray = []) {
  const outputArray = defaultArray;

  for (const product of inputArray) {
    const { type, color, quantity, price, priceForPair } = product;

    const enabledProductIndex = outputArray.findIndex(
      enabledProduct =>
        enabledProduct.type === type &&
        enabledProduct.color === color &&
        enabledProduct.price === price &&
        enabledProduct.priceForPair === priceForPair,
    );

    if (enabledProductIndex >= 0) {
      outputArray[enabledProductIndex].quantity += parseInt(quantity, 10);
    } else {
      outputArray.push({ ...product, quantity: Number(quantity) });
    }
  }

  return outputArray;
}

function optimizationFiles(req) {
  const { url } = req;
  const filename = url.pathname.slice(url.pathname.lastIndexOf('/'));
  const pathToOriginalFile = MAIN + filename;
  const pathToOptimizedFile = OPTIMIZATION + filename;
  const inputStream = fs.createReadStream(pathToOriginalFile);

  let sortedProductsArray;
  let stringRemnant = '';

  inputStream.on('data', chunk => {
    let productsString = chunk;
    if (Buffer.isBuffer(chunk)) productsString = chunk.toString('utf8');

    if (stringRemnant) {
      stringRemnant += productsString.split('{', 1)[0];
    }

    const productsStringJson =
      stringRemnant +
      productsString.slice(
        productsString.indexOf('{'),
        productsString.lastIndexOf('}') + 1,
      );
    stringRemnant = productsString.slice(productsString.lastIndexOf('}') + 2);

    const productsArrayJson = JSON.parse(`[${productsStringJson}]`);

    sortedProductsArray = sortArray(productsArrayJson, sortedProductsArray);
  });
  inputStream.on('end', () => {
    console.log('Successfully Optimizate array products');

    let totalQuantity = 0;
    for (const product of sortedProductsArray) {
      totalQuantity += product.quantity;
    }
    console.log('Total quantity products: ', totalQuantity);

    fs.writeFile(
      pathToOptimizedFile,
      JSON.stringify(sortedProductsArray, 0, '  '),
      () => {
        fs.unlink(pathToOriginalFile, () => console.log('File deleted'));
      },
    );
  });
  inputStream.on('error', err => console.log(err));
}

module.exports = optimizationFiles;
