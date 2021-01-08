const throwIfInvalid = require('./throwIfInvalid');

function getAndCheckId(stringId) {
  const id = parseInt(stringId, 10);

  throwIfInvalid(id, 400, 'No product id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  return id;
}

module.exports = getAndCheckId;
