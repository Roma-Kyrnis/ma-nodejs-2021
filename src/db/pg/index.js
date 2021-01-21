const { Pool } = require('pg');

const {
  tables: { PRODUCTS, TYPES, COLORS },
  db: {
    names: { PG },
  },
} = require('../../config');
const { throwIfInvalid } = require('../../utils');

const dbProducts = require('./products');
const dbTypes = require('./types');
const dbColors = require('./colors');

let database;
let client;

async function createDBWithTables() {
  await client.query(`SELECT 'CREATE DATABASE ${database}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${database}')`);

  await client.query(
    `CREATE TABLE IF NOT EXISTS ${TYPES}(
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        UNIQUE(type),
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP DEFAULT NULL
      )`,
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS ${COLORS}(
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        color VARCHAR(255) NOT NULL,
        UNIQUE(color),
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP DEFAULT NULL
      )`,
  );

  await client.query(
    `CREATE TABLE IF NOT EXISTS ${PRODUCTS}(
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          "typeId" INT NOT NULL REFERENCES ${TYPES},
          "colorId" INT NOT NULL REFERENCES ${COLORS},
          price NUMERIC(10,2) DEFAULT 0.0,
          UNIQUE("typeId", "colorId", price),
          quantity BIGINT NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL,
          deleted_at TIMESTAMP DEFAULT NULL
            )`,
  );
}

async function testConnection() {
  console.log(`Hello from ${PG} testConnection`);
  await client.query('SELECT NOW()');
}

async function close() {
  console.log(`INFO: Closing ${PG} DB wrapper`);
  client.end();
}

module.exports = config => {
  throwIfInvalid(config, 500, 'No config!');

  throwIfInvalid(config.database, 500, 'Undefined database');
  database = config.database;

  client = new Pool(config);

  const products = dbProducts(client);
  const types = dbTypes(client);
  const colors = dbColors(client);

  return {
    createDBWithTables,
    testConnection,
    close,

    // --------------

    products,
    types,
    colors,
  };
};
