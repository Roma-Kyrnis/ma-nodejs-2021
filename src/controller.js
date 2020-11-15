const fs = require('fs');
const path = require('path');

const {
  tasks: { task1: sort, task2: biggestPrice, task3 },
  generateSale,
} = require('./services');

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

function sale(request, response) {
  const { method } = request;

  if (method !== 'GET') return methodNotAllowed(response);

  const arraySales = task3(store);
  const result = generateSale(arraySales);

  return ok(response, result);
}

module.exports = {
  functionOne,
  functionTwo,
  functionThree,
  setDataGlobal,
  writeDataInFile,
  sale,
};
