function getAuthToken(headers) {
  if (!headers.authorization || headers.authorization.indexOf(' ') === -1) {
    const err = new Error('Missing Authorization Header');
    err.status = 401;
    throw err;
  }

  const token = headers.authorization.split(' ')[1];

  if (token === null) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  return token;
}

module.exports = getAuthToken;
