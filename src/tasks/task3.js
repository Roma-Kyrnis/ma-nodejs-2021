const namesObjectData = {
  TYPE: 'type',
  COLOR: 'color',
  QUANTITY: 'quantity',
  PRICE: 'price',
  PRICE_FOR_PAIR: 'priceForPair',
};

module.exports = arrayClothes => {
  let typesClothes = [];

  arrayClothes.forEach(clothes => {
    const keys = Object.keys(clothes);

    if (typesClothes.length === 0) typesClothes = keys;
    else {
      keys.forEach(type => {
        if (!typesClothes.includes(type)) typesClothes.push(type);
      });
    }
  });

  const result = arrayClothes.map(clothes => {
    const obj = { ...clothes };

    const oneOfData = name => {
      for (const value in namesObjectData) {
        if (name === namesObjectData[value]) return true;
      }
      return false;
    };

    typesClothes.forEach(type => {
      if (!(type in obj) && oneOfData(type)) {
        if (type === namesObjectData.PRICE) {
          obj[namesObjectData.PRICE] = clothes[namesObjectData.PRICE_FOR_PAIR];
        } else if (type === namesObjectData.PRICE_FOR_PAIR) {
          obj[namesObjectData.PRICE_FOR_PAIR] = '$'.concat(
            clothes[namesObjectData.PRICE].split('$')[1] * 2,
          );
        } else if (type === namesObjectData.QUANTITY) {
          obj[namesObjectData.QUANTITY] = 0;
        }
      }
    });

    return obj;
  });

  return result;
};
