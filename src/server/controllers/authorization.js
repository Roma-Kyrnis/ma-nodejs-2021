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
    const tokens = await authorization.login(username, password);

    return res.status(200).json(tokens);
  }

  return res
    .status(401)
    .json({ message: 'Invalid Authentication Credentials' });
}

async function refreshTokens(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  if (token === null) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const tokens = await authorization.refreshTokens(token);

    return res.status(200).json(tokens);
  } catch (err) {
    console.log(err.message || err);
    return res.status(403).json({ message: 'Forbidden' });
  }
}

async function logout(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  if (token === null) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await authorization.logout(token);

    return res.status(200).json({ message: 'logout' });
  } catch (err) {
    console.log(err.message || err);
    return res.status(403).json({ message: 'Forbidden' });
  }
}

module.exports = { login, refreshTokens, logout };
