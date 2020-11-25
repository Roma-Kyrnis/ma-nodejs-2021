// eslint-disable-next-line no-extend-native
Array.prototype.myMap = (oldArray, callback) => {
  const newArray = [];

  for (let i = 0; i < oldArray.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    newArray.push(callback(oldArray[i], i, oldArray));
  }

  return newArray;
};

module.exports = arrayClothes => {
  const result = arrayClothes.myMap(arrayClothes, clothes => {
    const { price, priceForPair, quantity } = clothes;

    return {
      ...clothes,
      quantity: quantity || 0,
      price: price || `$${priceForPair.split('$')[1] / 2}`,
      priceForPair: priceForPair || `$${price.split('$')[1] * 2}`,
      discount: 0,
    };
  });

  return result;
};
