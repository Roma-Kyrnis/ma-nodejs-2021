const { user } = require('../../config');
const {
  accessToken: { generateAccessToken },
} = require('../../utils');

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
      const token = await generateAccessToken({ username });

      return res.json({ token });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: 'Invalid auth token provided.' });
    }
  }

  return res
    .status(401)
    .json({ message: 'Invalid Authentication Credentials' });
}

module.exports = login;
