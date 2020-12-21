const {
  createDiscount: { generateValidDiscountPromise },
} = require('../../../services');
const fullClothes = require('./fullClothes');
const { store } = require('../../../utils');

async function salesAsync(req, res) {
  const arrayClothes = fullClothes(store.get());
  const outputArray = [];
  try {
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }

  return res.status(200).json({ products: outputArray });
}

module.exports = salesAsync;
