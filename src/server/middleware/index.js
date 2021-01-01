const {
  authorizationTokens: { verifyAccessToken },
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
  const token = req.headers.authorization.split(' ')[1];
  if (token === null) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const data = await verifyAccessToken(token);

    req.authData = data;

    return next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: 'Forbidden' });
  }
}

module.exports = { errorHandler, authenticateToken };
