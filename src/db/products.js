/* eslint-disable no-restricted-syntax */
const client = require('./pg');
const {
  db: { database },
  tables: { PRODUCTS },
} = require('../config');

async function createDBWithTable() {
  try {
    await client.query(`SELECT 'CREATE DATABASE ${database}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${database}')`);

    await client.query(
      `CREATE TABLE IF NOT EXISTS ${PRODUCTS}(
          id INT GENERATED ALWAYS AS IDENTITY,
          type VARCHAR(255),
          color VARCHAR(255),
          price NUMERIC(10,2),
          quantity BIGINT NOT NULL,
          created_at TIMESTAMP DEFAULT NULL,
          updated_at TIMESTAMP DEFAULT NULL,
          deleted_at TIMESTAMP DEFAULT NULL,
          PRIMARY KEY (type, color, price)
        )`,
    );
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

async function createProduct({ type, color, price, quantity }) {
  try {
    const timestamp = new Date();

    const res = await client.query(
      `INSERT INTO ${PRODUCTS}(type, color, price, quantity, created_at, updated_at, deleted_at)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (type, color, price) DO UPDATE
        SET quantity = ${PRODUCTS}.quantity + $4
      RETURNING *`,
      [type, color, price, quantity, timestamp, timestamp, null],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProduct(id) {
  try {
    // const res = await client.query(
    //   `IF EXISTS (SELECT lastval(id) FROM ${PRODUCTS} WHERE deleted_at IS NULL) THEN (SELECT NOW()) ELSE (SELECT lastval(id) FROM ${PRODUCTS})`,
    // );
    const res = await client.query(
      `SELECT * FROM ${PRODUCTS} WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllProducts() {
  try {
    const res = await client.query(
      `SELECT * FROM ${PRODUCTS} WHERE deleted_at IS NULL`,
    );

    return res.rows;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateProduct({ id, ...product }) {
  const query = [];
  const values = [];

  for (const [index, [key, value]] of Object.entries(product).entries()) {
    query.push(`${key} = $${index + 1}`);
    values.push(value);
  }

  if (!values.length) {
    const err = new Error('ERROR: Nothing to update');
    err.status = 400;
    throw err;
  }

  values.push(parseInt(id, 10));

  try {
    const res = await client.query(
      `UPDATE ${PRODUCTS} SET ${query.join(',')} WHERE id = $${
        values.length
      } RETURNING *`,
      values,
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function deleteProduct(id) {
  try {
    await client.query(`UPDATE ${PRODUCTS} SET deleted_at = $1 WHERE id = $2`, [
      new Date(),
      id,
    ]);

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = {
  createDBWithTable,
  testConnection,
  close,
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
