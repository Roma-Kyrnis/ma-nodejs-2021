const {
  tasks: { task3 },
  createDiscount: { generateValidDiscount },
} = require('../../../services');
const { store, httpResponses } = require('../../../utils');

function salesCallback(request, response) {
  const { method } = request;

  if (method !== 'GET') return httpResponses.methodNotAllowed(response);

  const arrayClothes = task3(store.get());

  const arrayCallback = lastCallback => {
    const getDiscount = (clothes, discountCallback) => {
      const sumFunctions = (func, times = 1, startDiscount = 0, callback) => {
        func((err, discount) => {
          if (err) return callback(err);

          if (times > 1) {
            return sumFunctions(
              func,
              times - 1,
              discount + startDiscount,
              callback,
            );
          }

          return callback(null, discount + startDiscount);
        });
      };

      if (clothes.type === 'hat' && clothes.color === 'red') {
        return sumFunctions(generateValidDiscount, 3, 0, discountCallback);
      }

      if (clothes.type === 'hat') {
        return sumFunctions(generateValidDiscount, 2, 0, discountCallback);
      }

      return generateValidDiscount(discountCallback);
    };

    const outputArray = [];

    const everyDiscountCallback = (err, discount) => {
      if (err) return lastCallback(err);

      outputArray.push({ ...arrayClothes[outputArray.length], discount });

      if (arrayClothes.length === outputArray.length) {
        return lastCallback(null, outputArray);
      }

      return getDiscount(
        arrayClothes[outputArray.length],
        everyDiscountCallback,
      );
    };

    getDiscount(arrayClothes[0], everyDiscountCallback);
  };

  return arrayCallback((err, res) => {
    if (err) {
      console.error('array callback', err);
      return httpResponses.internalServerError(response);
    }

    return httpResponses.ok(response, { clothes: res });
  });
}

module.exports = salesCallback;
