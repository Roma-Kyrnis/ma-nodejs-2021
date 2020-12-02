let store = require('../../inputData');

function set(data) {
  store = data;
}

function get() {
  return store;
}

module.exports = { set, get };
