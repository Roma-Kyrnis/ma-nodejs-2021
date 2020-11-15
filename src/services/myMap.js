const { promisify } = require('util');

const { sale } = require('../config');

// eslint-disable-next-line no-extend-native
Array.prototype.myMap = (oldArray, callback) => {
  const newArray = [];

  for (let i = 0; i < oldArray.length; i++) {
    newArray.push(callback(oldArray[i], i, oldArray));
  }

  return newArray;
};

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSaleOne(callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = randomNumber(sale.MIN, sale.MAX);

      if (result >= sale.NOT_MORE_THAN) {
        reject(callback(new Error('Incorrect sale')));
      }

      resolve(callback(result));
    }, sale.TIME_GENERATE_SALE);
  });
}

function generateSaleTwo(callback) {
  promisify(
    setTimeout(() => {
      const result = randomNumber(sale.MIN, sale.MAX);

      if (result >= sale.NOT_MORE_THAN) {
        throw callback(new Error('Incorrect sale'));
      }

      return callback(result);
    }, sale.TIME_GENERATE_SALE),
  );
}

async function one(callback) {
  const result = await generateSale(callback);
  if (result.name === 'Error') console.error(result);
  // else resolve(result);
  //         return new Promise((resolve, reject) => {
  // });
}

async function start() {
  try {
    const res = await one(console.log);

    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

start();

module.exports = generateSaleOne;
// const numbers = [1, 4, 9];
// numbers.myMap(numbers, console.log);
