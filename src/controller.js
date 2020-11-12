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

function isIncorrectData(data) {
  if (!Array.isArray(data) || data.length === 0) return true;

  const incorrectArray = data.filter(
    value =>
      typeof value !== 'object' ||
      !(
        'type' in value &&
        'color' in value &&
        ('price' in value || 'priceForPair' in data[0])
      ),
  );
  if (incorrectArray.length !== 0) return true;

  return false;
}

module.exports.task1 = (request, response) => {
  const { method, queryParams } = request;
  const arrayClothes = store || [];

  if (method !== 'GET') methodNotAllowed(response);
  if (!queryParams.name && !queryParams.value) {
    badRequest(response, { Message: 'No param!' });
  }

  let { value } = queryParams;
  if (typeof Number(value) === 'number') value = Number(value);

  const result = sort(arrayClothes, queryParams.name, value);

  return ok(response, result);
};

module.exports.task2 = (request, response) => {
  const { method } = request;

  if (method !== 'GET') return methodNotAllowed(response);

  return ok(response, biggestPrice);
};

module.exports.task3 = (request, response) => {
  const { method } = request;
  const arrayClothes = store || [];

  if (method !== 'GET') return methodNotAllowed(response);

  const result = task3(arrayClothes);

  return ok(response, result);
};

module.exports.setDataGlobal = (request, response) => {
  const { method, body: data } = request;

  if (method !== 'POST') return methodNotAllowed(response);
  if (isIncorrectData(data)) {
    return badRequest(response, { message: 'Incorrect data!' });
  }

  store = data;

  return ok(response);
};

module.exports.writeDataInFile = (request, response) => {
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
};
