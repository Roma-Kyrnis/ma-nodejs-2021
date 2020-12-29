const jwt = require('jsonwebtoken');

const {
  server: {
    ACCESS: { SECRET_KEY, TOKEN_LIFE, REFRESH_TOKEN_LIFE },
  },
} = require('../config');

function generateAccessToken(user) {
  return new Promise((resolve, reject) => {
    jwt.sign(user, SECRET_KEY, { expiresIn: TOKEN_LIFE }, (err, token) => {
      if (err) return reject(err);

      return resolve(token);
    });
  });
}

function generateRefreshToken(user, secretKey) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      user,
      secretKey,
      { expiresIn: REFRESH_TOKEN_LIFE },
      (err, token) => {
        if (err) return reject(err);

        return resolve(token);
      },
    );
  });
}

function verifyAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, data) => {
      if (err) reject(err);

      resolve(data);
    });
  });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
};
