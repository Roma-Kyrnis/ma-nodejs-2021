module.exports = (arrayClothes, param, value) => {
  const result = arrayClothes.filter(clothes => clothes[param] === value);

  return result;
};
