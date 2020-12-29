const crypto = require('crypto');

const {
  users: { HASH_SECRET },
} = require('../config');

function createHash(login, password) {
  const hash = crypto
    .createHmac('sha256', HASH_SECRET)
    .update(login)
    .update(password)
    .digest('hex');

  return hash;
}

module.exports = createHash;
