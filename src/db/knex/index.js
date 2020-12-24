/* eslint-disable no-restricted-syntax */
const Knex = require('knex');

const { throwIfInvalid } = require('../../utils');

const dbProducts = require('./products');
const dbTypes = require('./types');
const dbColors = require('./colors');

let database;
let knex;

async function createDBIfNotExists() {
  try {
    await knex.raw(`SELECT 'CREATE DATABASE ${database}'
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
    await knex.raw('SELECT NOW()');
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function close() {
  console.log('INFO: Closing pg DB wrapper');
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
