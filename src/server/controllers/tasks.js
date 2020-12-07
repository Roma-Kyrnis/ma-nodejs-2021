const { store } = require('../../utils');
const {
  tasks: { task1: sort, task2: biggestPrice, task3 },
} = require('../../services');

function functionOne(req, res) {
  const { query } = req;
  const arrayClothes = store.get() || [];

  if (!query.name && !query.value) {
    return res.status(200).json({ Message: 'No param!' });
  }

  let { value } = query;
  if (!Number.isNaN(Number(value))) value = Number(value);

  const result = sort(arrayClothes, query.name, value);

  return res.status(200).json(result);
}

function functionTwo(req, res) {
  return res.status(200).json(biggestPrice);
}

function functionThree(req, res) {
  const arrayClothes = store.get() || [];

  const result = task3(arrayClothes);

  return res.status(200).json(result);
}

module.exports = { functionOne, functionTwo, functionThree };
