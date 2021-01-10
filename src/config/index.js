require('dotenv').config();

const defaultAdmins = require('../../admins.json');

const fatalError = require('../utils/fatalError');

const config = {
  server: {
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost',
    HASH_SECRET: process.env.HASH_SECRET || fatalError('No HASH_SECRET'),
    ACCESS: {
      SECRET_KEY:
        process.env.ACCESS_TOKEN_SECRET || fatalError('No ACCESS_TOKEN_SECRET'),
      REFRESH_TOKEN_SECRET:
        process.env.REFRESH_TOKEN_SECRET ||
        fatalError('No REFRESH_TOKEN_SECRET'),
      TOKEN_LIFE:
        process.env.ACCESS_TOKEN_LIFE || fatalError('No ACCESS_TOKEN_LIFE'),
      REFRESH_TOKEN_LIFE:
        process.env.ACCESS_REFRESH_TOKEN_LIFE ||
        fatalError('No ACCESS_REFRESH_TOKEN_LIFE'),
    },
    OPTIMIZATION_TIME: process.env.OPTIMIZATION_TIME || 10 * 60 * 1000, // 10 minutes
  },

  db: {
    defaultType: process.env.DB_WRAPPER_TYPE || 'knex',

    config: {
      knex: {
        client: 'postgresql',
        connection: {
          user:
            process.env.DB_USER || fatalError('FATAL: DB_USER is not defined'),
          host:
            process.env.DB_HOST || fatalError('FATAL: DB_HOST is not defined'),
          port:
            process.env.DB_PORT || fatalError('FATAL: DB_PORT is not defined'),
          database:
            process.env.DB_NAME || fatalError('FATAL: DB_NAME is not defined'),
          password:
            process.env.DB_PASS || fatalError('FATAL: DB_PASS is not defined'),
        },
        pool: {
          min: 2,
          max: 10,
        },
        debug: true,
      },
      pg: {
        user:
          process.env.DB_USER || fatalError('FATAL: DB_USER is not defined'),
        host:
          process.env.DB_HOST || fatalError('FATAL: DB_HOST is not defined'),
        port:
          process.env.DB_PORT || fatalError('FATAL: DB_PORT is not defined'),
        database:
          process.env.DB_NAME || fatalError('FATAL: DB_NAME is not defined'),
        password:
          process.env.DB_PASS || fatalError('FATAL: DB_PASS is not defined'),
      },
    },
  },

  tables: {
    PRODUCTS: 'products',
    TYPES: 'types',
    COLORS: 'colors',
    ADMINS: 'admins',
    ORDERS: 'orders',
  },

  seeds: {
    TYPES: ['socks', 'gloves', 'hat', 'jeans'],
    COLORS: ['red', 'black', 'lime', 'navy', 'purple'],
  },

  sale: {
    MIN: 1,
    MAX: 99,
    NOT_MORE_THAN: 20,
    TIME_GENERATE_SALE: 50,
  },

  fileStorage: {
    MAIN: `${process.cwd()}/uploads`,
    OPTIMIZATION: `${process.cwd()}/uploads/optimized`,
    NAME_OPTIMIZED_FOLDER: 'optimized',
  },

  defaultAdmins: defaultAdmins || fatalError('Admins are not defined'),

  orders: {
    STATUSES: {
      OPEN: 'відкрито',
      DONE: 'опрацьовано',
      CANCEL: 'відмінено',
    },
  },

  products: {
    WEIGHTS: {
      DEFAULT: 0.1, // kilogram, min for nova poshta
      SOCKS: 0.06,
      HAT: 0.3,
      JEANS: 0.7,
      GLOVES: 0.3,
    },
  },

  nova_poshta: {
    BASE_URL: 'https://api.novaposhta.ua/v2.0/json/',
    API_KEY:
      process.env.NOVA_POSHTA_API_KEY || fatalError('No NOVA_POSHTA_API_KEY'),
    DELIVERY_PRICE: {
      MODEL_NAME: 'InternetDocument',
      CALLED_METHOD: 'getDocumentPrice',
      OFFICE_LOCATION: 'Київ',
      CARGO_TYPE: 'Parcel',
      SERVICE_TYPE: 'WarehouseWarehouse',
    },
    WAREHOUSES: {
      MODEL_NAME: 'AddressGeneral',
      CALLED_METHOD: 'getWarehouses',
      LIMIT: 5,
      PAGE: 1,
      LANGUAGE: 'ru',
    },
  },
};

module.exports = config;
