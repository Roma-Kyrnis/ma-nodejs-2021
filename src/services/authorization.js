const { admins } = require('../db');
const {
  accessToken: { generateAccessToken, generateRefreshToken },
  createAdminHash,
  throwIfInvalid,
} = require('../utils');

async function login(username, password) {
  const tokens = { refreshToken: await generateRefreshToken({ username }) };

  const adminData = await admins.updateAdmin({
    hash: createAdminHash(username, password),
    refreshToken: tokens.refreshToken,
  });
  throwIfInvalid(adminData, 400, 'Invalid username or password');

  tokens.token = `JWT ${await generateAccessToken({ username })}`;

  return tokens;
}

module.exports = { login };
