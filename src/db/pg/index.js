const { Pool } = require('pg');

const { throwIfInvalid } = require('../../utils');

const dbProducts = require('./products');
const dbTypes = require('./types');
const dbColors = require('./colors');

let database;
let client;

async function createDBIfNotExists() {
  try {
    await client.query(`SELECT 'CREATE DATABASE ${database}'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${database}')`);

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function testConnection() {
  try {
    console.log('Hello from pg testConnection');
    await client.query('SELECT NOW()');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function close() {
  console.log('INFO: Closing pg DB wrapper');
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
    createDBIfNotExists,
    testConnection,
    close,

    // --------------

    products,
    types,
    colors,
  };
};
