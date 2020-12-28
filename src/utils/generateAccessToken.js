const jwt = require('jsonwebtoken');

function generateAccessToken(username, secretKey) {
  return new Promise((resolve, reject) => {
    jwt.sign(username, secretKey, { expiresIn: '1800s' }, (err, token) => {
      if (err) return reject(err);

      return resolve(token);
    });
  });
}

module.exports = generateAccessToken;
