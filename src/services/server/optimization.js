const { server } = require('../../config');

let ticker;

function optimization() {
  console.log('Optimization');
}

function setPeriodOptimization() {
  ticker = setInterval(optimization, server.OPTIMIZATION_TIME);
}

function stopOptimization() {
  clearInterval(ticker);
}

module.exports = { setPeriodOptimization, stopOptimization };
