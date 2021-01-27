jest.mock('../throwIfInvalid.js');
const throwIfInvalid = require('../throwIfInvalid');

const getAndCheckId = require('../getAndCheckId');

describe('check and return id', () => {
  beforeAll(() => {
    throwIfInvalid.mockImplementation((isValid, status, message) => {
      if (isValid) return true;
      return false;
    });
  });

  test('should throw error that function implement without param stringId', () => {
    const id = getAndCheckId();

    expect(id).toBeFalsy();
    expect(throwIfInvalid).toHaveBeenCalledWith(
      undefined,
      400,
      'No product id defined',
    );
  });

  test('should throw error that no number defined in string', () => {
    const id = getAndCheckId('sadfsadf');

    expect(id).toBeFalsy();
    expect(throwIfInvalid).toHaveBeenLastCalledWith(
      !Number.isNaN(NaN),
      400,
      'Incorrect id',
    );
  });

  test('should return id', () => {
    const id = getAndCheckId('15');

    expect(id).toEqual(15);
  });
});
