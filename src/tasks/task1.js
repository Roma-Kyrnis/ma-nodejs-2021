const QUANTITY = 'quantity';
const PRICE = 'price';
const PRICE_FOR_PAIR = 'priceForPair';

module.exports = (arrayClothes, param, value) => {
  const result = [];

  arrayClothes.forEach(clothes => {
    if (param in clothes && clothes[param] === value) result.push(clothes);
    else if (param === QUANTITY && value === 0) result.push(clothes);
    else if (param === PRICE_FOR_PAIR && clothes.price === value) {
      result.push(clothes);
    } else if (param === PRICE && clothes.priceForPair === value) {
      result.push(clothes);
    }
  });

  return result;
};
