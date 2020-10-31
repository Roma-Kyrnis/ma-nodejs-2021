const QUANTITY = 'quantity';
const PRICE = 'price';
const PRICE_FOR_PAIR = 'priceForPair';

module.exports = arrayClothes => {
  let typesClothes = [];

  arrayClothes.forEach(clothes => {
    const keys = Object.keys(clothes);

    if (typesClothes.length === 0) typesClothes = keys;
    else
      keys.forEach(type => {
        if (!typesClothes.includes(type)) typesClothes.push(type);
      });
  });

  const result = arrayClothes.map(clothes => {
    const obj = Object.assign(clothes);

    typesClothes.forEach(type => {
      if (!(type in obj))
        if (type === PRICE) obj[PRICE] = clothes[PRICE_FOR_PAIR];
        else if (type === PRICE_FOR_PAIR)
          obj[PRICE_FOR_PAIR] = '$'.concat(clothes[PRICE].split('$')[1] * 2);
        else if (type === QUANTITY) obj[QUANTITY] = 0;
    });

    return obj;
  });

  return result;
};
