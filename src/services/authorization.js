const { admins } = require('../db');
const {
  authorizationTokens: {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
  },
  createAdminHash,
  throwIfInvalid,
} = require('../utils');

async function login(username, password) {
  const tokens = { refreshToken: await generateRefreshToken({ username }) };

  const adminData = await admins.updateAdminRefreshToken({
    hash: createAdminHash(username, password),
    refreshToken: tokens.refreshToken,
  });
  throwIfInvalid(adminData, 400, 'Invalid username or password');

  tokens.token = await generateAccessToken({ username });

  return tokens;
}

async function checkRefreshToken(token) {
  const { username } = await verifyRefreshToken(token);
  if (!username) throw new Error('No username in token');

  const { 'refresh-token': refreshToken } = await admins.getAdminRefreshToken({
    name: username,
  });

  if (!refreshToken) throw new Error('Token in db not exists');
  if (refreshToken !== token) throw new Error('Incorrect token');

  return username;
}

async function refreshTokens(token) {
  const username = await checkRefreshToken(token);

  const newAccessToken = await generateAccessToken({ username });
  const newRefreshToken = await generateRefreshToken({ username });

  await admins.updateAdminRefreshToken({
    name: username,
    refreshToken: newRefreshToken,
  });

  return { token: newAccessToken, refreshToken: newRefreshToken };
}

async function logout(token) {
  const username = await checkRefreshToken(token);

  await admins.updateAdminRefreshToken({
    name: username,
    refreshToken: null,
  });

  return true;
}

module.exports = { login, refreshTokens, logout };
