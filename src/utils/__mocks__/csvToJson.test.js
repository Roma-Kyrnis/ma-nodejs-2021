jest.mock('stream', () => ({
  Transform: jest.fn(({ transform, flush }) => ({ transform, flush })),
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

const csvToJson = require('../csvToJson');

describe('check transform function', () => {
  const { transform, flush } = csvToJson();

  test('should transform input chunk to output string', () => {
    const inputStringHeaders = 'type,color,quantity,price,isPair';
    const inputStringProductPair = 'socks,red,8,10,true';
    const inputStringProductNoPair = 'hat,red,8,10,false';
    const inputStreamHeaders = Buffer.from(inputStringHeaders, 'utf8');
    const inputStreamProductPair = Buffer.from(inputStringProductPair, 'utf8');
    const inputStreamProductNoPair = Buffer.from(
      inputStringProductNoPair,
      'utf8',
    );

    const callback = jest.fn();

    transform(inputStreamHeaders, 'buffer', callback);

    expect(callback).toHaveBeenCalledWith(null, '[');

    transform(inputStreamProductPair, 'buffer', callback);

    expect(callback).toHaveBeenLastCalledWith(
      null,
      '{"type":"socks","color":"red","quantity":"8","priceForPair":"10"}',
    );

    transform(inputStreamProductNoPair, 'buffer', callback);

    expect(callback).toHaveBeenLastCalledWith(
      null,
      ',\n{"type":"hat","color":"red","quantity":"8","price":"10"}',
    );
  });

  test('should add square bracket to the end of file', () => {
    const callback = jest.fn();

    flush(callback);

    expect(callback).toHaveBeenCalledWith(null, ']');
  });
});
