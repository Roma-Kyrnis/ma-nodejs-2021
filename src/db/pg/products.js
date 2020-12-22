/* eslint-disable no-restricted-syntax */
const {
  tables: { PRODUCTS, TYPES, COLORS },
} = require('../../config');
const { throwIfInvalid } = require('../../utils');

let pgClient;

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  try {
    const timestamp = new Date();

    const {
      rows: [typeId],
    } = await pgClient.query(
      `SELECT id
        FROM ${TYPES}
        WHERE type = $1`,
      [type],
    );
    throwIfInvalid(
      typeId,
      400,
      'Cannot add this product, no such type defined in the table types',
    );

    const {
      rows: [colorId],
    } = await pgClient.query(
      `SELECT id
        FROM ${COLORS}
        WHERE color = $1`,
      [color],
    );
    throwIfInvalid(
      colorId,
      400,
      'Cannot add this product, no such color defined in the table colors',
    );

    const res = await pgClient.query(
      `INSERT INTO ${PRODUCTS}("typeId", "colorId", price, quantity, created_at, updated_at, deleted_at)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT ("typeId", "colorId", price) DO UPDATE
        SET quantity = ${PRODUCTS}.quantity + $4
      RETURNING *`,
      [typeId.id, colorId.id, price, quantity, timestamp, timestamp, null],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProduct(id) {
  try {
    const res = await pgClient.query(
      `SELECT ${TYPES}.type,
              ${COLORS}.color,
              ${PRODUCTS}.price,
              ${PRODUCTS}.quantity
        FROM ${PRODUCTS}
        INNER JOIN ${TYPES}
          ON ${PRODUCTS}."typeId" = ${TYPES}.id
        INNER JOIN ${COLORS}
          ON ${PRODUCTS}."colorId" = ${COLORS}.id
        WHERE ${PRODUCTS}.id = $1 AND ${PRODUCTS}.deleted_at IS NULL`,
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
    const res = await pgClient.query(
      `SELECT *
        FROM ${PRODUCTS}
        INNER JOIN ${TYPES}
          ON ${TYPES}.id = ${PRODUCTS}."typeId"
        INNER JOIN ${COLORS}
          ON ${COLORS}.id = ${PRODUCTS}."colorId"
        WHERE ${PRODUCTS}.deleted_at IS NULL`,
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

  const timestamp = new Date();

  for await (const [index, [key, value]] of Object.entries(product).entries()) {
    let updatedValue;

    if (key === 'type') {
      const typeData = await pgClient.query(
        `
          INSERT INTO ${TYPES}(type, created_at, updated_at, deleted_at)
            VALUES($1, $2, $3, $4)
          ON CONFLICT (type)
            DO UPDATE
              SET updated_at = excluded.updated_at
          RETURNING *
        `,
        [value, timestamp, timestamp, null],
      );

      updatedValue = typeData.rows[0].id;

      query.push(`"typeId" = $${index + 1}`);
    } else if (key === 'color') {
      const colorData = await pgClient.query(
        `
            INSERT INTO ${COLORS}(color, created_at, updated_at, deleted_at)
              VALUES($1, $2, $3, $4)
            ON CONFLICT (color)
              DO UPDATE
              SET updated_at = excluded.updated_at
            RETURNING *
          `,
        [value, timestamp, timestamp, null],
      );

      updatedValue = colorData.rows[0].id;

      query.push(`"colorId" = $${index + 1}`);
    } else {
      updatedValue = value;

      query.push(`${key} = $${index + 1}`);
    }

    values.push(updatedValue);
  }

  if (!values.length) {
    const err = new Error('ERROR: Nothing to update');
    err.status = 400;
    throw err;
  }

  values.push(parseInt(id, 10));

  try {
    const res = await pgClient.query(
      `UPDATE ${PRODUCTS} SET ${query.join(',')} WHERE id = $${
        values.length
      } RETURNING *`,
      values,
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(
      !err,
      400,
      'Cannot update, table already has this product',
    );
  }
}

async function deleteProduct(id) {
  try {
    await pgClient.query(
      `UPDATE ${PRODUCTS} SET deleted_at = $1 WHERE id = $2`,
      [new Date(), id],
    );

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = client => {
  pgClient = client;

  return {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
  };
};
