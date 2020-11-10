module.exports = (arrayClothes, param, value) => {
  const result = arrayClothes.filter(clothes => {
    if (clothes[param] === value) return clothes;
  });

  return result;
};
