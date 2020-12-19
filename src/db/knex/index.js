/* eslint-disable no-restricted-syntax */
const Knex = require('knex');

const {
  db: { database },
  tables: { PRODUCTS, TYPES, COLORS },
} = require('../../config');

const { throwIfInvalid } = require('../../utils');

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

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  try {
    const timestamp = new Date();

    const [typeId] = await knex(TYPES)
      .insert({
        type,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning('id')
      .onConflict('type')
      .merge()
      .returning('id');

    const [colorId] = await knex(COLORS)
      .insert({
        color,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning('id')
      .onConflict('color')
      .merge()
      .returning('id');

    const [product] = await knex(PRODUCTS)
      .insert({
        typeId,
        colorId,
        price,
        quantity,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning('*')
      .onConflict(['typeId', 'colorId', 'price'])
      .merge({ quantity: knex.raw(`products.quantity + ${quantity}`) })
      .returning('*');

    return product;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProduct(id) {
  try {
    console.log(id);
    const [res] = await knex(PRODUCTS)
      .where(`${PRODUCTS}.id`, id)
      .join(TYPES, `${PRODUCTS}.typeId`, '=', `${TYPES}.id`)
      .join(COLORS, `${PRODUCTS}.colorId`, '=', `${COLORS}.id`)
      .select(
        `${TYPES}.type`,
        `${COLORS}.color`,
        `${PRODUCTS}.price`,
        `${PRODUCTS}.quantity`,
      );

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllProducts() {
  try {
    const res = await knex(PRODUCTS)
      .join(TYPES, `${PRODUCTS}.typeId`, '=', `${TYPES}.id`)
      .join(COLORS, `${PRODUCTS}.colorId`, '=', `${COLORS}.id`)
      .select(
        `${TYPES}.type`,
        `${COLORS}.color`,
        `${PRODUCTS}.price`,
        `${PRODUCTS}.quantity`,
      );

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateProduct({ id, ...product }) {
  const query = {};
  let queryLength = 0;

  const timestamp = new Date();

  for await (const [index, [key, value]] of Object.entries(product).entries()) {
    switch (key) {
      case 'type':
        [query.typeId] = await knex(TYPES)
          .insert({
            type: product.type,
            created_at: timestamp,
            updated_at: timestamp,
          })
          .returning('id')
          .onConflict('type')
          .merge()
          .returning('id');

        queryLength += 1;

        break;

      case 'color':
        [query.colorId] = await knex(COLORS)
          .insert({
            color: product.color,
            created_at: timestamp,
            updated_at: timestamp,
          })
          .returning('id')
          .onConflict('color')
          .merge()
          .returning('id');

        queryLength += 1;

        break;

      default:
        query[key] = value;
        queryLength += 1;

        break;
    }
  }

  throwIfInvalid(!queryLength, 400, 'Nothing to update');

  try {
    const [res] = await knex(PRODUCTS)
      .where({ id })
      .update(query)
      .returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteProduct(id) {
  try {
    await knex(PRODUCTS).where({ id }).update({ deleted_at: new Date() });

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = config => {
  knex = new Knex(config);

  return {
    createDBWithTables,
    testConnection,
    close,
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
  };
};
