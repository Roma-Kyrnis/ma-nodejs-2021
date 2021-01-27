const throwIfInvalid = require('../throwIfInvalid');

describe('check if it valid or not ', () => {
  test('if it invalid should throw an error', () => {
    const wrapperThrowIfInvalid = () => {
      throwIfInvalid(false, 429, 'My mess@ge!');
    };

    expect(wrapperThrowIfInvalid).toThrow('My mess@ge!');

    try {
      throwIfInvalid(false, 429, 'sdfasdgewq3sadg2354');
    } catch (err) {
      expect(err).toEqual(new Error('sdfasdgewq3sadg2354'));
      expect(err.status).toEqual(429);
    }
  });

  test('if it valid should return true', () => {
    expect(throwIfInvalid(true, 400, 'message')).toBeTruthy();
  });
});
