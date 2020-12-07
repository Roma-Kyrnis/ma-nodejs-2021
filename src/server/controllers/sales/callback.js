const {
  tasks: { task3 },
  createDiscount: { generateValidDiscount },
} = require('../../../services');
const { store } = require('../../../utils');

function salesCallback(req, res) {
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

  return arrayCallback((err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json({ products: result });
  });
}

module.exports = salesCallback;
