const { task1: sort, task2: biggestPrice, task3: modify } = require('./tasks');

function ok(res, body) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.write(JSON.stringify(body));
  res.end();
}

function badRequest(res, message) {
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

function internalServerError(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 500;
  res.write(JSON.stringify({ message: 'Internal error occurred' }));
  res.end();
}

function task1() {
  

  sort(arrayClothers, param, value);
}
