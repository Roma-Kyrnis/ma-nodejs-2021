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
  const promise = promisify((time, func) => setTimeout(func, time));

  await promise(SALE.TIME_GENERATE_SALE);

  const number = randomNumber(SALE.MIN, SALE.MAX);

  if (number >= SALE.NOT_MORE_THAN) {
    return callback('Incorrect sale!');
  }

  return callback(0, number);
}

function promiseFunction() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = randomNumber(SALE.MIN, SALE.MAX);

      if (result >= SALE.NOT_MORE_THAN) {
        return reject(new Error('Incorrect sale: SALE'));
      }
      return resolve(result);
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

async function methodPromise() {
  let result;

  try {
    result = await promiseFunction();
  } catch (err) {
    result = await methodPromise();
  }

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

async function coverAsync() {
  let res;

  try {
    res = await methodAsync();
  } catch (err) {
    console.log(err);
  }

  return res;
}

async function generateSale(nameFunction, times = 1) {
  let discount;

  if (nameFunction === SALE.CALLBACK) discount = await methodCallback();
  if (nameFunction === SALE.PROMISE) discount = await methodPromise();
  if (nameFunction === SALE.ASYNC) discount = await coverAsync();

  if (times > 1) {
    const result = await generateSale(nameFunction, times - 1);

    const numberDiscount = (
      ((100 - discount) / 100) *
      ((100 - result) / 100)
    ).toFixed(2);

    const percentDiscount = 100 - Number(numberDiscount) * 100;

    return percentDiscount;
  }

  return discount;
}

async function sale(arrayClothes, nameFunction) {
  const result = await arrayClothes.myMap(arrayClothes, async value => {
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

  return result;
}

module.exports = sale;
