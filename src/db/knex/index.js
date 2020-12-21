/* eslint-disable no-restricted-syntax */
const Knex = require('knex');

const {
  db: { database },
  tables: { PRODUCTS, TYPES, COLORS },
} = require('../../config');

const dbProducts = require('./products');
const dbTypes = require('./types');
const dbColors = require('./colors');

let knex;

async function createDBWithTables() {
  try {
    await knex.raw(`SELECT 'CREATE DATABASE ${database}'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${database}')`);

    const hasTableTypes = await knex.schema.hasTable(TYPES);
    if (!hasTableTypes) {
      await knex.schema.createTable(TYPES, table => {
        table.increments('id');
        table.string('type').notNullable();
        table.unique('type');
        table.timestamps();
      });
    }

    const hasTableColors = await knex.schema.hasTable(COLORS);
    if (!hasTableColors) {
      await knex.schema.createTable(COLORS, table => {
        table.increments('id');
        table.string('color').notNullable();
        table.unique('color');
        table.timestamps();
      });
    }

    const hasTableProducts = await knex.schema.hasTable(PRODUCTS);
    if (!hasTableProducts) {
      await knex.schema.createTable(PRODUCTS, table => {
        table.specificType('id', 'INT GENERATED ALWAYS AS IDENTITY');
        table.integer('typeId').references('id').inTable('types').notNullable();
        table
          .integer('colorId')
          .references('id')
          .inTable('colors')
          .notNullable();
        table.decimal('price').nullable().defaultTo(0.0);
        table.unique(['typeId', 'colorId', 'price']);
        table.integer('quantity').notNullable().defaultTo(1);
        table.timestamp('deleted_at').nullable().defaultTo(null);
        table.timestamps();
      });
    }
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
    createDBWithTables,
    testConnection,
    close,

    // --------------

    products,
    types,
    colors,
  };
};
