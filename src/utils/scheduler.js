let ticker;

function setScheduler(callback, repeatTime) {
  ticker = setInterval(callback, repeatTime);
}

function stopScheduler() {
  clearInterval(ticker);
}

module.exports = { setScheduler, stopScheduler };
