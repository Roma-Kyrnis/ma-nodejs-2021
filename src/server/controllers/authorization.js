const { authorization } = require('../../services');

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

  if (username && password) {
    const userTokens = await authorization.login(username, password);

    return res.json(userTokens);
  }

  return res
    .status(401)
    .json({ message: 'Invalid Authentication Credentials' });
}

async function refreshTokens(req, res) {}

async function logout(req, res) {}

module.exports = { login };
