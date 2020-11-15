const numbers = [1, 4, 9];

// eslint-disable-next-line no-extend-native
Array.prototype.myMap = (oldArray, callback) => {
  const newArray = [];

  for (let i = 0; i < oldArray.length; i++) {
    newArray.push(callback(oldArray[i], i, oldArray));
  }

  return newArray;
};

// numbers.myMap(numbers, console.log);

const generateTime = 50;

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateSale(callback) {
  return new Promise(() => {
    setTimeout(() => {
      let result = randomNumber(1, 99);

      if (result >= 20) result = new Error('Incorrect sale');

      callback(result);
    }, generateTime);
  });
}

async function one(callback) {
  const result = await generateSale(callback);
  if (result.name === 'Error') console.error(result);
  // else resolve(result);
  //         return new Promise((resolve, reject) => {
  // });
}

async function start() {
  try {
    const res = await one(console.log);

    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

start();
