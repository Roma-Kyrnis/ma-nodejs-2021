const Knex = require('knex');

const {
  db: {
    names: { KNEX },
  },
} = require('../../config');
const { throwIfInvalid } = require('../../utils');

const dbProducts = require('./products');
const dbTypes = require('./types');
const dbColors = require('./colors');

let database;
let knex;

async function createDBIfNotExists() {
  await knex.raw(`SELECT 'CREATE DATABASE ${database}'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${database}')`);

  return true;
}

async function testConnection() {
  console.log(`Hello from ${KNEX} testConnection`);

  await knex.raw('SELECT NOW()');
}

async function close() {
  console.log(`INFO: Closing ${KNEX} DB wrapper`);
  // no close fot knex
}

module.exports = config => {
  throwIfInvalid(config, 500, 'No config!');

  throwIfInvalid(config.connection.database, 500, 'Undefined database');
  database = config.connection.database;

  knex = new Knex(config);

  const products = dbProducts(knex);
  const types = dbTypes(knex);
  const colors = dbColors(knex);

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
