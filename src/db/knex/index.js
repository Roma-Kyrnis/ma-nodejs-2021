/* eslint-disable no-restricted-syntax */
const Knex = require('knex');

const {
  db: { database },
} = require('../../config');

const dbProducts = require('./products');
const dbTypes = require('./types');
const dbColors = require('./colors');

let knex;

async function createDBIfNotExists() {
  try {
    await knex.raw(`SELECT 'CREATE DATABASE ${database}'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${database}')`);
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
