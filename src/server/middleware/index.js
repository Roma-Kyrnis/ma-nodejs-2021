const jwt = require('jsonwebtoken');
const {
  user,
  server: { SECRET_KEY },
} = require('../../config');
const { generateAccessToken } = require('../../utils');

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

async function login(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader.indexOf('Basic ') === -1) {
    return res.status(401).json({ message: 'Missing Authorization Header' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii',
  );
  const [username, password] = credentials.split(':');

  if (username === user.NAME && password === user.PASSWORD) {
    try {
      const token = await generateAccessToken(username);

      res.json({ token });
    } catch (err) {
      return res.status(400).json({ message: 'Invalid auth token provided.' });
    }
  }

  return res
    .status(401)
    .json({ message: 'Invalid Authentication Credentials' });
}

// eslint-disable-next-line consistent-return
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, SECRET_KEY, (err, data) => {
    console.log(err);
    if (err) return res.sendStatus(403);

    req.authData = data;

    return next();
  });
}

module.exports = { errorHandler, login, authenticateToken };
