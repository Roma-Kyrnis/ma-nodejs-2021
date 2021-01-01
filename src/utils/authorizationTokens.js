const jwt = require('jsonwebtoken');

const {
  server: {
    ACCESS: {
      SECRET_KEY,
      REFRESH_TOKEN_SECRET,
      TOKEN_LIFE,
      REFRESH_TOKEN_LIFE,
    },
  },
} = require('../config');

function generateToken(payload, secretKey, tokenLife) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, { expiresIn: tokenLife }, (err, token) => {
      if (err) return reject(err);

      return resolve(token);
    });
  });
}

function verifyToken(token, secretKey) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, data) => {
      if (err) return reject(err);

      return resolve(data);
    });
  });
}

function generateAccessToken(payload) {
  return generateToken(payload, SECRET_KEY, TOKEN_LIFE);
}

function generateRefreshToken(payload) {
  return generateToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE);
}

function verifyAccessToken(token) {
  return verifyToken(token, SECRET_KEY);
}

function verifyRefreshToken(token) {
  return verifyToken(token, REFRESH_TOKEN_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
