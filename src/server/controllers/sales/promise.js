const {
  tasks: { task3 },
  createDiscount: { generateValidDiscountPromise },
} = require('../../../services');
const { store } = require('../../../utils');

function salesPromise(req, res) {
  const arrayClothes = task3(store.get());

  const arrayPromise = arrayClothes.map(clothes => {
    const validDiscountPromises = [generateValidDiscountPromise()];

    if (clothes.type === 'hat') {
      validDiscountPromises.push(generateValidDiscountPromise());

      if (clothes.color === 'red') {
        validDiscountPromises.push(generateValidDiscountPromise());
      }
    }

    return Promise.all(validDiscountPromises).then(discounts => {
      let result = 0;

      discounts.forEach(discount => {
        result += discount;
      });

      return result;
    });
  });

  return Promise.all(arrayPromise)
    .then(arrayDiscounts => {
      const outputArray = arrayClothes.map((clothes, index) => {
        return { ...clothes, discount: arrayDiscounts[index] };
      });

      return res.status(200).json({ products: outputArray });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    });
}

module.exports = salesPromise;
