/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const path = require('path');

const {
  tasks: { task1: sort, task2: biggestPrice, task3 },
  createDiscount,
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

// function salesCallback(request, response) {
//   const { method } = request;

//   if (method !== 'GET') return methodNotAllowed(response);

//   const arrayClothes = task3(store);

//   return callbackCreateSale(arrayClothes, (err, result) => {
//     if (err) {
//       console.error('In controller salesCallback', err);

//       return internalServerError(response);
//     }

//     return ok(response, result);
//   });
// }

// async function salesPromise(request, response) {
//   const { method } = request;

//   if (method !== 'GET') return methodNotAllowed(response);

//   const arrayClothes = task3(store);

//   return promiseCreateSale(arrayClothes, (err, result) => {
//     if (err) {
//       console.error('In controller promiseCreateSale', err);

//       return internalServerError(response);
//     }

//     return ok(response, result);
//   });
// }

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
      discount = await sumFunctions(createDiscount, 3);
    } else if (isEqualTypes(SALE.DOUBLE, clothes)) {
      discount = await sumFunctions(createDiscount, 2);
    } else discount = await createDiscount();

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
  // salesCallback,
  // salesPromise,
  salesAsync,
};
