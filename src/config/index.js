require('dotenv').config();

const config = {
  server: {
    PORT: process.env.PORT,
    ORIGIN: process.env.ORIGIN,
  },
  sale: {
    MIN: 1,
    MAX: 99,
    NOT_MORE_THAN: 20,
    TIME_GENERATE_SALE: 50,
    DOUBLE: clothes => clothes.type === 'hat',
    TRIPLE: clothes => clothes.type === 'hat' && clothes.color === 'red',
    CALLBACK: 'callback',
    PROMISE: 'promise',
    ASYNC: 'async',
  },
};

module.exports = config;
