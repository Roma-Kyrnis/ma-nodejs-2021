const fatalError = require('../fatalError');

describe('check create hash', () => {
  test('should create sha256 secure hash from hash_secret, login and password', async () => {
    const processSpy = jest.spyOn(process, 'exit');
    processSpy.mockImplementation(() => {});

    const consoleSpy = jest.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});

    fatalError('Test');

    expect(processSpy).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalledWith('FATAL: Test');
  });
});
