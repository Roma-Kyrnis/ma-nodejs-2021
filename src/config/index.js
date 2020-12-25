require('dotenv').config();

const fatalError = require('../utils/fatalError');

const config = {
  server: {
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost',
    OPTIMIZATION_TIME: process.env.OPTIMIZATION_TIME || 10 * 60 * 1000, // 10 minutes
  },

  db: {
    user: process.env.DB_USER || fatalError('DB_USER is not defined'),
    host: process.env.DB_HOST || fatalError('DB_HOST is not defined'),
    port: process.env.DB_PORT || fatalError('DB_PORT is not defined'),
    database: process.env.DB_NAME || fatalError('DB_NAME is not defined'),
    password: process.env.DB_PASS || fatalError('DB_PASS is not defined'),
  },

  tables: {
    PRODUCTS: 'products',
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
