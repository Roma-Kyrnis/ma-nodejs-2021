const fs = require('fs');
const path = require('path');

const { task1: sort, task2: biggestPrice, task3 } = require('./tasks');

let store = require('./inputData');

function ok(res, body = { message: 'Ok' }) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.write(JSON.stringify(body));
  res.end();
}

function badRequest(res, message = { message: 'Bad request!' }) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 400;
  res.write(JSON.stringify(message));
  res.end();
}

function methodNotAllowed(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 405;
  res.write(JSON.stringify({ message: 'Method not allowed!' }));
  res.end();
}

function isCorrectData(data) {
  if (
    !data.isArray() ||
    typeof data[0] !== 'object' ||
    !('type' in data[0]) ||
    !('color' in data[0]) ||
    !('price' in data[0] || 'priceForPair' in data[0])
  ) {
    return false;
  }
  return true;
}

module.exports.task1 = (request, response) => {
  const { method, queryParams } = request;
  const arrayClothes = store || [];

  if (method !== 'GET') methodNotAllowed(response);
  if (!queryParams.name && !queryParams.value) {
    badRequest(response, { Message: 'No param!' });
  }

  const result = sort(arrayClothes, queryParams.name, queryParams.value);

  ok(response, result);
};

module.exports.task2 = (request, response) => {
  const { method } = request;

  if (method !== 'GET') methodNotAllowed(response);

  ok(response, biggestPrice);
};

module.exports.task3 = (request, response) => {
  const { method } = request;
  const arrayClothes = store || [];

  if (method === 'GET') methodNotAllowed(response);

  const result = task3(arrayClothes);

  ok(request, result);
};

module.exports.setDataGlobal = (request, response) => {
  const { method, body: data } = request;

  if (method === 'POST') methodNotAllowed(response);
  if (isCorrectData(data)) badRequest(response, { message: 'Incorrect data!' });

  store = data;

  ok(response);
};

module.exports.writeDataInFile = (request, response) => {
  const { method, body: data } = request;

  if (method === 'POST') methodNotAllowed(response);
  if (isCorrectData(data)) badRequest(response, { message: 'Incorrect data!' });

  fs.writeFileSync(
    path.resolve(__dirname, 'inputData.json'),
    JSON.stringify(data),
  );

  store = data;

  ok(response);
};
