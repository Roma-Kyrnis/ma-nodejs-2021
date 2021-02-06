const getAuthToken = require('../getAuthToken');

describe('check headers`s token', () => {
  const headers = {
    authorization: 'Bearer fasdnknf.sdfasdf.dsafdsg23grabnwef0',
  };

  test('should throw error `Missing Authorization Header` when no authorization field', () => {
    const wrapperGetAuthToken = () => {
      getAuthToken({});
    };

    expect(wrapperGetAuthToken).toThrow('Missing Authorization Header');

    try {
      getAuthToken({});
    } catch (err) {
      expect(err).toEqual(new Error('Missing Authorization Header'));
      expect(err.status).toEqual(401);
    }
  });

  test('should throw an error `Missing Authorization Header` when no space in input string', () => {
    const wrapperGetAuthToken = () => {
      getAuthToken({ authorization: 'sadfh' });
    };

    expect(wrapperGetAuthToken).toThrow('Missing Authorization Header');

    try {
      getAuthToken({ authorization: 'sadfh' });
    } catch (err) {
      expect(err).toEqual(new Error('Missing Authorization Header'));
      expect(err.status).toEqual(401);
    }
  });

  test('should throw error `Unauthorized`', () => {
    const wrapperGetAuthToken = () => {
      getAuthToken({ authorization: ' ' });
    };

    expect(wrapperGetAuthToken).toThrow('Unauthorized');

    try {
      getAuthToken({ authorization: ' ' });
    } catch (err) {
      expect(err).toEqual(new Error('Unauthorized'));
      expect(err.status).toEqual(401);
    }
  });

  test('should check and then return token from headers object', () => {
    const token = getAuthToken(headers);

    expect(token).toEqual('fasdnknf.sdfasdf.dsafdsg23grabnwef0');
  });
});
