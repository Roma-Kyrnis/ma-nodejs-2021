/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');

const {
  tasks: { task1: sort, task2: biggestPrice, task3 },
  createDiscount: {
    generateValidDiscountAsync,
    generateValidDiscountPromise,
    generateValidDiscount,
  },
} = require('./services');
const { sale: SALE } = require('./config');

let store = require('./inputData');

function ok(res, body = { message: 'Ok' }) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(body));
}

function badRequest(res, message = { message: 'Bad request!' }) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 400;
  res.end(JSON.stringify(message));
}

function methodNotAllowed(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 405;
  res.end(JSON.stringify({ message: 'Method not allowed!' }));
}

function internalServerError(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 500;
  res.write(JSON.stringify({ message: 'Internal error occurred' }));
  res.end();
}

function isIncorrectData(data) {
  if (!Array.isArray(data) || data.length === 0) return true;

  const incorrectArray = data.filter(
    value =>
      !(value.color && value.type && (value.price || value.priceForPair)),
  );
  if (incorrectArray.length !== 0) return true;

  return false;
}

function functionOne(request, response) {
  const { method, queryParams } = request;
  const arrayClothes = store || [];

  if (method !== 'GET') return methodNotAllowed(response);
  if (!queryParams.name && !queryParams.value) {
    return badRequest(response, { Message: 'No param!' });
  }

  let { value } = queryParams;
  if (!Number.isNaN(Number(value))) value = Number(value);

  const result = sort(arrayClothes, queryParams.name, value);

  return ok(response, result);
}

function functionTwo(request, response) {
  const { method } = request;

  if (method !== 'GET') return methodNotAllowed(response);

  return ok(response, biggestPrice);
}

function functionThree(request, response) {
  const { method } = request;
  const arrayClothes = store || [];

  if (method !== 'GET') return methodNotAllowed(response);

  const result = task3(arrayClothes);

  return ok(response, result);
}

function setDataGlobal(request, response) {
  const { method, body: data } = request;

  if (method !== 'POST') return methodNotAllowed(response);
  if (isIncorrectData(data)) {
    return badRequest(response, { message: 'Incorrect data!' });
  }

  store = data;

  return ok(response);
}

function writeDataInFile(request, response) {
  const { method, body: data } = request;

  if (method !== 'POST') return methodNotAllowed(response);
  if (isIncorrectData(data)) {
    return badRequest(response, { message: 'Incorrect data!' });
  }

  fs.writeFileSync(
    path.resolve(__dirname, 'inputData.json'),
    JSON.stringify(data, 0, 2),
  );

  store = data;

  return ok(response);
}

function salesCallback(request, response) {
  const { method } = request;

  if (method !== 'GET') return methodNotAllowed(response);

  const arrayClothes = task3(store);

  const arrayCallback = lastCallback => {
    const getDiscount = (clothes, discountCallback) => {
      const isEqualTypes = (basedObject, equalObject) =>
        (basedObject.type ? equalObject.type === basedObject.type : true) &&
        (basedObject.color ? equalObject.color === basedObject.color : true);

      const sumFunctions = (func, times = 1, startDiscount = 0, callback) => {
        func((err, discount) => {
          if (err) return callback(err);

          if (times > 1) {
            return sumFunctions(
              func,
              times - 1,
              discount + startDiscount,
              callback,
            );
          }

          return callback(null, discount + startDiscount);
        });
      };

      if (isEqualTypes(SALE.TRIPLE, clothes)) {
        return sumFunctions(generateValidDiscount, 3, 0, discountCallback);
      }

      if (isEqualTypes(SALE.DOUBLE, clothes)) {
        return sumFunctions(generateValidDiscount, 2, 0, discountCallback);
      }

      return generateValidDiscount(discountCallback);
    };

    const outputArray = [];

    const everyDiscountCallback = (err, discount) => {
      if (err) return lastCallback(err);

      outputArray.push({ ...arrayClothes[outputArray.length], discount });

      if (arrayClothes.length === outputArray.length) {
        return lastCallback(null, outputArray);
      }

      return getDiscount(
        arrayClothes[outputArray.length],
        everyDiscountCallback,
      );
    };

    getDiscount(arrayClothes[0], everyDiscountCallback);
  };

  return arrayCallback((err, res) => {
    if (err) {
      console.error('array callback', err);
      return internalServerError(response);
    }

    return ok(response, { clothes: res });
  });
}

function salesPromise(request, response) {
  const { method } = request;

  if (method !== 'GET') return methodNotAllowed(response);

  const arrayClothes = task3(store);

  const arrayPromise = arrayClothes.map(clothes => {
    const isEqualTypes = (basedObject, equalObject) =>
      (basedObject.type ? equalObject.type === basedObject.type : true) &&
      (basedObject.color ? equalObject.color === basedObject.color : true);

    const sumFunctions = (func, times = 1, startDiscount = 0) => {
      return func().then(discount => {
        if (times > 1) {
          return sumFunctions(func, times - 1, discount + startDiscount);
        }

        return discount + startDiscount;
      });
    };

    const promiseGenerateFunc = generateValidDiscountPromise();
    if (isEqualTypes(SALE.TRIPLE, clothes)) {
      return sumFunctions(promiseGenerateFunc, 3);
    }

    if (isEqualTypes(SALE.DOUBLE, clothes)) {
      return sumFunctions(promiseGenerateFunc, 2);
    }

    return promiseGenerateFunc();
  });

  return Promise.all(arrayPromise)
    .then(arrayDiscounts => {
      console.log(arrayDiscounts);

      const outputArray = arrayClothes.map((clothes, index) => {
        return { ...clothes, discount: arrayDiscounts[index] };
      });

      ok(response, { clothes: outputArray });
    })
    .catch(err => {
      console.error('In promise all', err);
      internalServerError(response);
    });
}

async function salesAsync(request, response) {
  const { method } = request;

  if (method !== 'GET') return methodNotAllowed(response);

  const arrayClothes = task3(store);

  const outputArray = [];
  for await (const clothes of arrayClothes) {
    const isEqualTypes = (basedObject, equalObject) =>
      (basedObject.type ? equalObject.type === basedObject.type : true) &&
      (basedObject.color ? equalObject.color === basedObject.color : true);

    const sumFunctions = async (func, times = 1) => {
      const sale = await func();
      if (times > 1) return sale + (await sumFunctions(func, times - 1));

      return sale;
    };

    let discount;
    if (isEqualTypes(SALE.TRIPLE, clothes)) {
      discount = await sumFunctions(generateValidDiscountAsync, 3);
    } else if (isEqualTypes(SALE.DOUBLE, clothes)) {
      discount = await sumFunctions(generateValidDiscountAsync, 2);
    } else discount = await generateValidDiscountAsync();

    outputArray.push({ ...clothes, discount });
  }

  return ok(response, { clothes: outputArray });
}

module.exports = {
  functionOne,
  functionTwo,
  functionThree,
  setDataGlobal,
  writeDataInFile,
  salesCallback,
  salesPromise,
  salesAsync,
};
