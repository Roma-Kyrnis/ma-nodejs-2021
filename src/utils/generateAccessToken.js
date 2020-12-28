const jwt = require('jsonwebtoken');

const {
  server: { SECRET_KEY },
} = require('../config');

function generateAccessToken(username) {
  jwt.sign(username, SECRET_KEY, { expiresIn: '1800s' }, (err, token) => {
    return token;
  });
}

module.exports = generateAccessToken;
