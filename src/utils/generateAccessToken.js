const jwt = require('jsonwebtoken');

const {
  server: { SECRET_KEY },
} = require('../config');

function generateAccessToken(username) {
  return new Promise((resolve, reject) => {
    jwt.sign(username, SECRET_KEY, { expiresIn: '1800s' }, (err, token) => {
      if (err) return reject(err);

      return resolve(token);
    });
  });
}

module.exports = generateAccessToken;
