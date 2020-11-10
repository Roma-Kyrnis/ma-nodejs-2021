// const inputData = require('./inputData.json');

// const { task1: sort, task2: biggestPrice, task3: modify } = require('./tasks');

// function boot(data, param, value) {
//   const sortedArray = sort(data, param, value);
//   console.log(sortedArray);

//   const totalArray = modify(sortedArray);
//   console.log(totalArray);

//   console.log(biggestPrice);
// }

// boot(inputData, 'price', '$6');

const http = require('http');

const requestsHandler = require('./requestHandler');
const { PORT } = require('./config').server;

const server = http.createServer(requestsHandler);
server.listen(Number(PORT), () => {
  console.log('Server started.');
});
