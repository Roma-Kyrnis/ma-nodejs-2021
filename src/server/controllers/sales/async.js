const {
  tasks: { task3 },
  createDiscount: { generateValidDiscountPromise },
} = require('../../../services');
const { store, httpResponses } = require('../../../utils');

async function salesAsync(request, response) {
  const { method } = request;

  if (method !== 'GET') return httpResponses.methodNotAllowed(response);

  const arrayClothes = task3(store.get());

  const outputArray = [];
  for await (const clothes of arrayClothes) {
    let discount = await generateValidDiscountPromise();
    if (clothes.type === 'hat') {
      discount += await generateValidDiscountPromise();

      if (clothes.color === 'red') {
        discount += await generateValidDiscountPromise();
      }
    }

    outputArray.push({ ...clothes, discount });
  }

  return httpResponses.ok(response, { clothes: outputArray });
}

module.exports = salesAsync;
