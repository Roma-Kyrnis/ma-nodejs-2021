const { server } = require('../config');

let ticker;

function setScheduler(callback) {
  ticker = setInterval(callback, server.OPTIMIZATION_TIME);
}

function stopScheduler() {
  clearInterval(ticker);
}

module.exports = { setScheduler, stopScheduler };
