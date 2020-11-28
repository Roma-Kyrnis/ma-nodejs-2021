/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');

const {
  tasks: { task1: sort, task2: biggestPrice, task3 },
  createDiscount: { generateValidDiscountPromise, generateValidDiscount },
  writeCSVFile,
  getNameFilesInUploads,
  optimizationFiles,
} = require('./services');

let store = require('./inputData');

function ok(res, body = { message: 'Ok' }) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify(body));
}

function accepted(res, body = { message: 'Accepted' }) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 202;
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

      if (clothes.type === 'hat' && clothes.color === 'red') {
        return sumFunctions(generateValidDiscount, 3, 0, discountCallback);
      }

      if (clothes.type === 'hat') {
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
    const validDiscountPromises = [generateValidDiscountPromise()];

    if (clothes.type === 'hat') {
      validDiscountPromises.push(generateValidDiscountPromise());

      if (clothes.color === 'red') {
        validDiscountPromises.push(generateValidDiscountPromise());
      }
    }

    return Promise.all(validDiscountPromises).then(discounts => {
      let result = 0;

      discounts.forEach(discount => {
        result += discount;
      });

      return result;
    });
  });

  return Promise.all(arrayPromise)
    .then(arrayDiscounts => {
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
    let discount = await generateValidDiscountPromise();
    if (clothes.type === 'hat') {
      discount += await generateValidDiscountPromise();

      if (clothes.color === 'red') {
        discount += await generateValidDiscountPromise();
      }
    }

    outputArray.push({ ...clothes, discount });
  }

  return ok(response, { clothes: outputArray });
}

async function writeAsyncInFile(request, response) {
  const { method } = request;

  if (method !== 'POST') return methodNotAllowed(response);

  try {
    await writeCSVFile(request);
  } catch (err) {
    console.error('In controller', err);
    return internalServerError(response);
  }

  return ok(response);
}

async function filenames(request, response) {
  const { method } = request;

  if (method !== 'GET') return methodNotAllowed(response);

  let names;
  try {
    names = await getNameFilesInUploads();
  } catch (err) {
    console.error('nameFiles In controller', err);
    return internalServerError(response);
  }

  return ok(response, names);
}

function optimization(request, response) {
  const { method } = request;

  if (method !== 'POST') return methodNotAllowed(response);

  optimizationFiles(request);

  return accepted(response);
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
  writeAsyncInFile,
  filenames,
  optimization,
};
