module.exports = (arrayClothes, param, value) => {
  return arrayClothes.filter(clothes => clothes[param] === value);
};
