const jsonwebtoken = require('jsonwebtoken');

jest.mock('jsonwebtoken');

// const authorization = require('../src/server/controllers/authorization');

const { authorizationTokens, createAdminHash } = require('../utils');

describe('check generate and verify authorization tokens', () => {
  const tokens = {};

  test('should generated access token', async () => {
    jsonwebtoken.sign.mockResolvedValue(
      Promise.resolve('fsadsdsasl328fj932..fdsa'),
    );

    const accessToken = await authorizationTokens.generateAccessToken({
      username: 'Test',
    });

    expect(jsonwebtoken.sign).toHaveBeenCalled();
    expect(jsonwebtoken.sign).toHaveBeenCalledTimes(1);
    expect(accessToken).toMatch(/^[a-zA-Z0-9.]+$/);

    tokens.access = accessToken;
  });

  test('should generated refresh token', async () => {
    jsonwebtoken.sign.mockResolvedValue(
      Promise.resolve('fsadsd3245.28fj932.sdfasa'),
    );

    const refreshToken = await authorizationTokens.generateRefreshToken({
      username: 'Test',
    });

    expect(jsonwebtoken.sign).toHaveBeenCalled();
    expect(jsonwebtoken.sign).toHaveBeenCalledTimes(2);
    expect(refreshToken).toMatch(/^[a-zA-Z0-9.]+$/);

    tokens.refresh = refreshToken;
  });

  test('should verify access token', async () => {
    jsonwebtoken.verify.mockResolvedValue(
      Promise.resolve('fsadsdsasl328fj932..fdsa'),
    );

    const accessToken = await authorizationTokens.verifyAccessToken(
      tokens.access,
    );

    expect(jsonwebtoken.verify).toHaveBeenCalled();
    expect(jsonwebtoken.verify).toHaveBeenCalledTimes(1);
    expect(accessToken).toMatch(/^[a-zA-Z0-9.]+$/);
    expect(accessToken).toBe(tokens.access);
  });

  test('should verify refresh token', async () => {
    jsonwebtoken.verify.mockResolvedValue(
      Promise.resolve('fsadsd3245.28fj932.sdfasa'),
    );

    const refreshToken = await authorizationTokens.verifyAccessToken(
      tokens.refresh,
    );

    expect(jsonwebtoken.verify).toHaveBeenCalled();
    expect(jsonwebtoken.verify).toHaveBeenCalledTimes(2);
    expect(refreshToken).toMatch(/^[a-zA-Z0-9.]+$/);
    expect(refreshToken).toBe(tokens.refresh);
  });
});

describe('check create hash', () => {
  test('should create sha256 secure hash from login and password', async () => {
    const adminHash = await createAdminHash('Test', '123456');

    expect(adminHash).toMatch(/^[a-z0-9]+$/);

    const fakeAdminHash = await createAdminHash('Test', '12345');

    expect(fakeAdminHash).toMatch(/^[a-z0-9]+$/);

    expect(fakeAdminHash).not.toBe(adminHash);
  });
});
