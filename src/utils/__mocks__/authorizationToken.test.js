const jsonwebtoken = require('jsonwebtoken');

jest.mock('jsonwebtoken');

const {
  generateToken,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require('../authorizationTokens');

describe('check generate and verify authorization tokens', () => {
  const token = 'fsadsdsasl328fj932..fdsa';

  test('should generated token', async () => {
    jsonwebtoken.sign.mockResolvedValue(Promise.resolve(token));

    const accessToken = await generateToken(
      {
        username: 'Test',
      },
      'secretKey',
      '10h',
    );

    expect(jsonwebtoken.sign).toHaveBeenCalledWith(
      {
        username: 'Test',
      },
      'secretKey',
      { expiresIn: '10h' },
    );
    expect(accessToken).toBe(token);
  });

  test('should verify token', async () => {
    jsonwebtoken.verify.mockResolvedValue(Promise.resolve(token));

    const verifiedToken = await verifyToken(token, 'secretKey');

    expect(jsonwebtoken.verify).toHaveBeenCalledWith(token, 'secretKey');
    expect(verifiedToken).toBe(token);
  });

  test('should generated access token', async () => {
    const accessToken = await generateAccessToken({ username: 'Test' });

    expect(accessToken).toEqual(token);
    expect(jsonwebtoken.sign).toHaveBeenCalledTimes(2);
  });

  test('should verify access token', async () => {
    const verifiedToken = await verifyAccessToken(token);

    expect(verifiedToken).toEqual(token);
    expect(jsonwebtoken.verify).toHaveBeenCalledTimes(2);
  });

  test('should generated refresh token', async () => {
    const refreshToken = await generateRefreshToken({ username: 'Test' });

    expect(refreshToken).toEqual(token);
    expect(jsonwebtoken.sign).toHaveBeenCalledTimes(3);
  });

  test('should verify refresh token', async () => {
    const verifiedToken = await verifyRefreshToken(token);

    expect(verifiedToken).toEqual(token);
    expect(jsonwebtoken.verify).toHaveBeenCalledTimes(3);
  });
});
