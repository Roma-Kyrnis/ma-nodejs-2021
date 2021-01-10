require('dotenv').config();

const fatalError = require('../utils/fatalError');

const config = {
  server: {
    PORT: process.env.PORT || 3000,
    HOST: process.env.HOST || 'localhost',
    OPTIMIZATION_TIME: process.env.OPTIMIZATION_TIME || 10 * 60 * 1000, // 10 minutes
  },

  db: {
    defaultType: process.env.DB_WRAPPER_TYPE || 'sequelize',

    names: {
      PG: 'pg',
      KNEX: 'knex',
      SEQUELIZE: 'sequelize',
    },

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
      sequelize: {
        dialect: 'postgres',

        username:
          process.env.DB_USER || fatalError('FATAL: DB_USER is not defined'),
        host:
          process.env.DB_HOST || fatalError('FATAL: DB_HOST is not defined'),
        port:
          process.env.DB_PORT || fatalError('FATAL: DB_PORT is not defined'),
        database:
          process.env.DB_NAME || fatalError('FATAL: DB_NAME is not defined'),
        password:
          process.env.DB_PASS || fatalError('FATAL: DB_PASS is not defined'),

        logging: true,
        pool: {
          min: 2,
          max: 10,
          idle: 5000,
          acquires: 5000,
          evict: 5000,
        },
      },
    },
  },

  tables: {
    PRODUCTS: 'products',
    TYPES: 'types',
    COLORS: 'colors',
  },

  seeds: {
    TYPES: ['socks', 'gloves', 'hat', 'jeans'],
    COLORS: ['red', 'black', 'lime', 'navy', 'purple'],
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
