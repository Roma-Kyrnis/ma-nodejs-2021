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

async function generateToken(payload, secretKey, tokenLife) {
  return await jwt.sign(payload, secretKey, { expiresIn: tokenLife });
}

async function verifyToken(token, secretKey) {
  return await jwt.verify(token, secretKey);
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
  generateToken,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
