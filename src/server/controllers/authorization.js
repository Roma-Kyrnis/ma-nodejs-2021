/* eslint-disable consistent-return */
const { authorization } = require('../../services');
const { getAuthToken, throwIfInvalid } = require('../../utils');

async function login(req, res, next) {
  let base64Credentials;
  try {
    base64Credentials = getAuthToken(req.headers);
  } catch (err) {
    return next(err);
  }
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii',
  );
  const [username, password] = credentials.split(':');

  if (username && password) {
    const tokens = await authorization.login(username, password);

    return res.status(200).json(tokens);
  }

  return res
    .status(401)
    .json({ message: 'Invalid Authentication Credentials' });
}

async function refreshTokens(req, res, next) {
  try {
    const token = getAuthToken(req.headers);

    try {
      const tokens = await authorization.refreshTokens(token);

      return res.status(200).json(tokens);
    } catch (err) {
      throwIfInvalid(!err, 403, 'Forbidden');
    }
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = getAuthToken(req.headers);

    try {
      await authorization.logout(token);

      return res.status(200).json({ message: 'logout' });
    } catch (err) {
      throwIfInvalid(!err, 403, 'Forbidden');
    }
  } catch (err) {
    return next(err);
  }
}

module.exports = { login, refreshTokens, logout };
