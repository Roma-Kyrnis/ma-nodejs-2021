require('dotenv').config();

const { fatalError } = require('../utils');

const config = {
  server: {
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost',
    OPTIMIZATION_TIME: process.env.OPTIMIZATION_TIME || 10 * 60 * 1000, // 10 minutes
  },

  user: {
    NAME: process.env.USER_NAME || fatalError('No user name'),
    PASSWORD: process.env.USER_PASSWORD || fatalError('No user password'),
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
