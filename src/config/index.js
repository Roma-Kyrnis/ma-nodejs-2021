require('dotenv').config();

const config = {
  server: {
    PORT: process.env.PORT || 3000,
    ORIGIN: process.env.ORIGIN || 'localhost',
    OPTIMIZATION_TIME: process.env.OPTIMIZATION_TIME || 10 * 60 * 1000, // 10 minutes
  },

  sale: {
    MIN: 1,
    MAX: 99,
    NOT_MORE_THAN: 20,
    TIME_GENERATE_SALE: 50,
  },

  dirStoreNames: {
    MAIN: `${process.cwd()}/uploads`,
    OPTIMIZATION: `${process.cwd()}/uploads/optimized`,
  },
};

module.exports = config;
