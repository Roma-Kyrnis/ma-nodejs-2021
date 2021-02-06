jest.mock('stream', () => ({
  Transform: jest.fn(({ transform }) => transform),
  Writable: jest.fn(({ write }) => write),
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

const csvToDB = require('../csvToDB');

describe('check transform and write functions', () => {
  test('should transform input chunk to output string', () => {
    const inputStringHeaders = 'type,color,quantity,price,isPair';
    const inputStringProduct = 'socks,red,8,10,true';
    const inputStreamHeaders = Buffer.from(inputStringHeaders, 'utf8');
    const inputStreamProduct = Buffer.from(inputStringProduct, 'utf8');

    const callback = jest.fn();

    const transformFunction = csvToDB.createTransformStreamToDB();

    transformFunction(inputStreamHeaders, 'buffer', callback);

    expect(callback).toHaveBeenLastCalledWith(null, '');

    transformFunction(inputStreamProduct, 'buffer', callback);

    expect(callback).toHaveBeenLastCalledWith(
      null,
      '{"type":"socks","color":"red","quantity":"8","price":"10"}',
    );
  });

  test('should either write input chunk to function or catch error', async () => {
    const inputStringProduct =
      '{"type":"socks","color":"red","quantity":"8","price":"10"}';
    const inputStreamProduct = Buffer.from(inputStringProduct, 'utf8');

    const errorIncorrectProduct = new Error('Incorrect product');

    const callback = jest.fn();
    const writeDBCallback = jest.fn();
    writeDBCallback
      .mockResolvedValueOnce(product => product)
      .mockReturnValue(Promise.reject(errorIncorrectProduct));

    const writeFunction = csvToDB.createWriteStreamToDB(writeDBCallback);

    writeFunction(inputStreamProduct, 'buffer', callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(writeDBCallback).toHaveBeenCalledWith(
      JSON.parse(inputStringProduct),
    );

    writeFunction('{}', 'buffer', callback);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(writeDBCallback.mock.results[1].value).rejects.toEqual(
      errorIncorrectProduct,
    );

    writeFunction('{}', 'buffer', callback);

    try {
      await writeDBCallback.mock.results[1].value;
    } catch (err) {
      expect(console.error).toHaveBeenLastCalledWith(errorIncorrectProduct);
    }
  });
});
