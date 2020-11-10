/* eslint-disable no-nested-ternary */
const namesObjectData = {
  QUANTITY: 'quantity',
  PRICE: 'price',
  PRICE_FOR_PAIR: 'priceForPair',
};

module.exports = arrayClothes => {
  const result = arrayClothes.map(clothes => {
    Object.values(namesObjectData).forEach(type => {
      if (!(type in clothes)) {
        return {
          ...clothes,
          [type]:
            type === namesObjectData.PRICE
              ? clothes[namesObjectData.PRICE_FOR_PAIR]
              : type === namesObjectData.PRICE_FOR_PAIR
              ? `$${clothes[namesObjectData.PRICE].split('$')[1] * 2}`
              : 0,
        };

        // if (type === namesObjectData.PRICE) {
        //   return {
        //     ...clothes,
        //     [type]: clothes[namesObjectData.PRICE_FOR_PAIR],
        //   };
        // }
        // if (type === namesObjectData.PRICE_FOR_PAIR) {
        //   return {
        //     ...clothes,
        //     [type]: `$${clothes[namesObjectData.PRICE].split('$')[1] * 2}`,
        //   };
        // }
        // if (type === namesObjectData.QUANTITY) {
        //   return {
        //     ...clothes,
        //     [type]: 0,
        //   };
        // }
      }
    });
  });

  return result;
};
