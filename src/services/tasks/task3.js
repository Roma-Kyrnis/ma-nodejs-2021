module.exports = arrayClothes => {
  const result = arrayClothes.map(clothes => {
    const { price, priceForPair, quantity } = clothes;

    return {
      ...clothes,
      quantity: quantity || 0,
      price: price || clothes.priceForPair / 2,
      priceForPair: priceForPair || `$${clothes.price.split('$')[1] * 2}`,
    };
  });

  return result;
};
