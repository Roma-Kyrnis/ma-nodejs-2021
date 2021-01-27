const throwIfInvalid = require('./throwIfInvalid');

function getAndCheckId(stringId) {
  throwIfInvalid(stringId, 400, 'No product id defined');

  const id = parseInt(stringId, 10);

  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  return id;
}

module.exports = getAndCheckId;
