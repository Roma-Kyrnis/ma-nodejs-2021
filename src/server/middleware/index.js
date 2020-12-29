const {
  accessToken: { verifyAccessToken },
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

// eslint-disable-next-line consistent-return
async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  try {
    const data = await verifyAccessToken(token);

    req.authData = data;

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
}

module.exports = { errorHandler, authenticateToken };
