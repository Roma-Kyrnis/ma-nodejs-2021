const { nextTick } = require('process');
const { promisify } = require('util');

const { sale: SALE } = require('../config');

// eslint-disable-next-line no-extend-native
Array.prototype.myMap = async (oldArray, callback) => {
  const newArray = [];

  for (let i = 0; i < oldArray.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    newArray.push(await callback(oldArray[i], i, oldArray));
  }

  return newArray;
};

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function callbackFunction(callback) {
  let result;

  setTimeout(() => {
    const number = randomNumber(SALE.MIN, SALE.MAX);

    if (number >= SALE.NOT_MORE_THAN) {
      result = callback(new Error('Incorrect sale: SALE'));
    }

    result = callback(0, number);
  }, SALE.TIME_GENERATE_SALE);

  return result;
}

function promiseFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = randomNumber(SALE.MIN, SALE.MAX);

      if (result >= SALE.NOT_MORE_THAN) {
        reject(new Error('Incorrect sale: SALE'));
      }

      resolve(result);
    }, SALE.TIME_GENERATE_SALE);
  });
}

async function methodCallback() {
  const result = await callbackFunction(async (err, res) => {
    if (err) {
      const func = await methodCallback();
      return func;
    }
    return res;
  });
  return result;
}

function methodPromise() {
  let result;

  promiseFunction()
    .then(res => {
      result = res;
    })
    .catch(() => {
      result = methodPromise();
    });

  return result;
}

async function methodAsync() {
  let result;

  try {
    result = await promiseFunction();
  } catch {
    result = await methodAsync();
  }

  return result;
}

async function generateSale(nameFunction, times = 1) {
  let discount;

  if (nameFunction === SALE.CALLBACK) discount = methodCallback();
  if (nameFunction === SALE.PROMISE) discount = methodPromise();
  if (nameFunction === SALE.ASYNC) discount = await methodAsync();

  if (times > 1) {
    const result = await generateSale(nameFunction, times - 1);
    return (discount / 100) * result;
  }

  return discount / 100;
}

async function sale(arrayClothes, nameFunction) {
  return arrayClothes.myMap(arrayClothes, async value => {
    const clothes = { ...value, sale: 0 };

    try {
      if (SALE.DOUBLE(value)) {
        clothes.sale = await generateSale(nameFunction, 2);
      } else if (SALE.TRIPLE(value)) {
        clothes.sale = await generateSale(nameFunction, 3);
      } else clothes.sale = await generateSale(nameFunction);
    } catch (err) {
      console.log('Can not generate sale');
    }

    return clothes;
  });
}

module.exports = sale;
