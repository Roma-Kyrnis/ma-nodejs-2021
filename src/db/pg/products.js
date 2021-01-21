/* eslint-disable no-restricted-syntax */
const {
  tables: { PRODUCTS, TYPES, COLORS },
} = require('../../config');
const { throwIfInvalid } = require('../../utils');

let pgClient;

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  const getTypeOrColorIdIfExist = async ({ name, value }) => {
    const tableName = name === 'type' ? TYPES : COLORS;
    const result = await pgClient.query(
      `SELECT id
          FROM ${tableName}
          WHERE ${name} = $1 AND
                deleted_at IS NULL`,
      [value],
    );
    throwIfInvalid(result.rows[0], 400, `No such ${name} defined`);
    return result.rows[0].id;
  };

  const typeId = await getTypeOrColorIdIfExist({ name: 'type', value: type });
  const colorId = await getTypeOrColorIdIfExist({
    name: 'color',
    value: color,
  });

  const timestamp = new Date();

  const res = await pgClient.query(
    `INSERT INTO ${PRODUCTS}("typeId", "colorId", price, quantity, created_at, updated_at, deleted_at)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT ("typeId", "colorId", price) DO UPDATE
        SET quantity = ${PRODUCTS}.quantity + $4
      RETURNING *`,
    [typeId, colorId, price, quantity, timestamp, timestamp, null],
  );

  return res.rows[0];
}

async function getProduct(id) {
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
}

async function getAllProducts() {
  const res = await pgClient.query(
    `SELECT ${PRODUCTS}.id,
            ${TYPES}.type,
            ${COLORS}.color,
            ${PRODUCTS}.price,
            ${PRODUCTS}.quantity
        FROM ${PRODUCTS}
        INNER JOIN ${TYPES}
          ON ${TYPES}.id = ${PRODUCTS}."typeId"
        INNER JOIN ${COLORS}
          ON ${COLORS}.id = ${PRODUCTS}."colorId"
        WHERE ${PRODUCTS}.deleted_at IS NULL`,
  );

  return res.rows;
}

async function getAllDeletedProducts() {
  const res = await pgClient.query(
    `SELECT ${PRODUCTS}.id,
            ${TYPES}.type,
            ${COLORS}.color,
            ${PRODUCTS}.price,
            ${PRODUCTS}.quantity,
            ${PRODUCTS}.deleted_at
        FROM ${PRODUCTS}
        INNER JOIN ${TYPES}
          ON ${TYPES}.id = ${PRODUCTS}."typeId"
        INNER JOIN ${COLORS}
          ON ${COLORS}.id = ${PRODUCTS}."colorId"
        WHERE ${PRODUCTS}.deleted_at IS NOT NULL`,
  );

  return res.rows;
}

async function updateProduct({ id, ...product }) {
  const getId = async (timestamp, { name, value }) => {
    const tableName = name === 'type' ? TYPES : COLORS;
    const result = await pgClient.query(
      `INSERT INTO ${tableName}(${name}, created_at, updated_at, deleted_at)
          VALUES($1, $2, $3, $4)
        ON CONFLICT (${name})
          DO UPDATE
            SET updated_at = excluded.updated_at
        RETURNING *`,
      [value, timestamp, timestamp, null],
    );
    return result.rows[0].id;
  };

  const query = [];
  const values = [];

  const timestamp = new Date();

  for await (const [index, [key, value]] of Object.entries(product).entries()) {
    switch (key) {
      case 'type':
        values.push(await getId(timestamp, { name: key, value }));
        query.push(`"typeId" = $${index + 1}`);
        break;

      case 'color':
        values.push(await getId(timestamp, { name: key, value }));
        query.push(`"colorId" = $${index + 1}`);
        break;

      default:
        values.push(value);
        query.push(`${key} = $${index + 1}`);
        break;
    }
  }

  throwIfInvalid(values.length, 400, 'Nothing to update');

  query.push(`updated_at = $${query.length}`);
  values.push(timestamp);

  values.push(parseInt(id, 10));

  try {
    const result = await pgClient.query(
      `UPDATE ${PRODUCTS} SET ${query.join(',')} WHERE id = $${
        values.length
      } RETURNING *`,
      values,
    );

    return result.rows[0];
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(!err, 400, 'Table already has this product');
  }
}

async function deleteProduct(id) {
  await pgClient.query(`UPDATE ${PRODUCTS} SET deleted_at = $1 WHERE id = $2`, [
    new Date(),
    id,
  ]);

  return true;
}

module.exports = client => {
  pgClient = client;

  return {
    createProduct,
    getProduct,
    getAllProducts,
    getAllDeletedProducts,
    updateProduct,
    deleteProduct,
  };
};
