const crypto = require('crypto');

const {
  server: { HASH_SECRET },
} = require('../config');

function createHash(login, password) {
  return crypto
    .createHmac('sha256', HASH_SECRET)
    .update(login)
    .update(password)
    .digest('hex');
}

module.exports = createHash;
