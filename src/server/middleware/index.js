const {
  authorizationTokens: { verifyAccessToken },
  getAuthToken,
  throwIfInvalid,
} = require('../../utils');

// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  console.error({ error }, 'Global catch errors');

  let errMessage = { message: 'Internal server error!' };
  if (error.status && parseInt(error.status, 10) !== 500 && error.message) {
    res.status(error.status);
    errMessage = { message: error.message };
  } else {
    res.status(500);
  }

  res.json(errMessage);
}

async function authenticateToken(req, res, next) {
  try {
    const token = getAuthToken(req.headers);

    try {
      const data = await verifyAccessToken(token);

      req.authData = data;
    } catch (err) {
      throwIfInvalid(!err, 403, 'Forbidden');
    }

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { errorHandler, authenticateToken };
