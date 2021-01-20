jest.mock('../../config', () => ({ server: { HASH_SECRET: '' } }));

const createAdminHash = require('../createAdminHash');

describe('check create hash', () => {
  test('should create sha256 secure hash from hash_secret, login and password', async () => {
    const adminHash = await createAdminHash('Test', '000');

    expect(adminHash).toBe(
      '45776540440aed873d30563e4b6ede9d4e702efdbfe2b107ba819c2e987357b2',
    );
  });
});
