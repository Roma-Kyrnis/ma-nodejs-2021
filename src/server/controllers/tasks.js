const { store, httpResponses } = require('../../utils');
const {
  tasks: { task1: sort, task2: biggestPrice, task3 },
} = require('../../services');

function functionOne(request, response) {
  const { method, queryParams } = request;
  const arrayClothes = store.get() || [];

  if (method !== 'GET') return httpResponses.methodNotAllowed(response);
  if (!queryParams.name && !queryParams.value) {
    return httpResponses.badRequest(response, { Message: 'No param!' });
  }

  let { value } = queryParams;
  if (!Number.isNaN(Number(value))) value = Number(value);

  const result = sort(arrayClothes, queryParams.name, value);

  return httpResponses.ok(response, result);
}

function functionTwo(request, response) {
  const { method } = request;

  if (method !== 'GET') return httpResponses.methodNotAllowed(response);

  return httpResponses.ok(response, biggestPrice);
}

function functionThree(request, response) {
  const { method } = request;
  const arrayClothes = store.get() || [];

  if (method !== 'GET') return httpResponses.methodNotAllowed(response);

  const result = task3(arrayClothes);

  return httpResponses.ok(response, result);
}

module.exports = { functionOne, functionTwo, functionThree };
