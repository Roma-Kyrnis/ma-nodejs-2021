const inputData = require('../../../inputData.json');

function biggestPrice(arrayClothes) {
  const result = { price: 0, clothes: {} };

  arrayClothes.forEach(clothes => {
    const price =
      (clothes.quantity || 0) *
      (clothes.priceForPair || clothes.price).split('$')[1];

    if (price > result.price) {
      result.price = price;
      result.clothes = clothes;
    }
  });

  return result.clothes;
}

module.exports = biggestPrice(inputData);
