const inputData = require('./inputData.json');

const {task1: sort, task2: biggestPrice, task3: modify} = require('./tasks');

function boot(data) {
  const sortedArray = sort(data, 'price', '$6');
  console.log(sortedArray);

  const totalArray = modify(sortedArray);
  console.log(totalArray);

  console.log(biggestPrice);
}

boot(inputData);
