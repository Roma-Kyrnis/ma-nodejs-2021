const {
  tasks: { task3 },
  createDiscount: { generateValidDiscountPromise },
} = require('../../../services');
const { store, httpResponses } = require('../../../utils');

function salesPromise(request, response) {
  const { method } = request;

  if (method !== 'GET') return httpResponses.methodNotAllowed(response);

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

      httpResponses.ok(response, { clothes: outputArray });
    })
    .catch(err => {
      console.error('In promise all', err);
      httpResponses.internalServerError(response);
    });
}

module.exports = salesPromise;
