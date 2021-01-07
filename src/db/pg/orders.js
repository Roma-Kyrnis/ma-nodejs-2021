const {
  tables: { ORDERS, PRODUCTS, TYPES, COLORS },
  orders: {
    STATUSES: { OPEN },
  },
} = require('../../config');

let pgClient;

async function createOrder({ productId, quantity = 1 }) {
  const timestamp = new Date();

  const result = await pgClient.query(
    `INSERT INTO ${ORDERS}("productId", quantity, status, created_at, updated_at)
      VALUES($1, $2, $3, $4, $5)
    RETURNING *`,
    [productId, quantity, OPEN, timestamp, timestamp],
  );

  // const [order] = await knex(ORDERS)
  //   .insert({
  //     productId,
  //     quantity,
  //     status: OPEN,
  //     created_at: timestamp,
  //     updated_at: timestamp,
  //   })
  //   .returning('*');

  return result.rows[0];
}

async function getOrder(orderNumber) {
  // return await knex(ORDERS)
  //   .where(`${ORDERS}.orderNumber`, orderNumber)
  //   .join(PRODUCTS, `${ORDERS}.productId`, '=', `${PRODUCTS}.id`)
  //   .join(TYPES, `${PRODUCTS}.typeId`, '=', `${TYPES}.id`)
  //   .join(COLORS, `${PRODUCTS}.colorId`, '=', `${COLORS}.id`)
  //   .select(
  //     `${ORDERS}.id`,
  //     `${ORDERS}.status`,
  //     `${ORDERS}.productId`,
  //     `${ORDERS}.quantity`,
  //     `${TYPES}.type`,
  //     `${COLORS}.color`,
  //     `${PRODUCTS}.price`,
  //   )
  //   .first();

  const result = await pgClient.query(
    `SELECT ${ORDERS}.id,
            ${ORDERS}.status,
            ${ORDERS}.productId,
            ${ORDERS}.quantity,
            ${TYPES}.type,
            ${COLORS}.color,
            ${PRODUCTS}.price
      FROM ${ORDERS}
      INNER JOIN ${PRODUCTS}
        ON ${ORDERS}."productId" = ${PRODUCTS}.id
      INNER JOIN ${TYPES}
        ON ${PRODUCTS}."typeId" = ${TYPES}.id
      INNER JOIN ${COLORS}
        ON ${PRODUCTS}."colorId" = ${COLORS}.id
      WHERE ${ORDERS}."orderNumber" = $1`,
    [orderNumber],
  );

  return result.rows[0];
}

async function getAllOrders() {
  // return await knex(ORDERS).select(`id`, `status`, `productId`, `quantity`);
  const result = await pgClient.query(
    `SELECT id, status, "productId", quantity
      FROM ${ORDERS}`,
  );

  return result.rows;
}

async function updateOrderStatus({ orderNumber, status }) {
  // const [res] = await knex(ORDERS)
  //   .where({ orderNumber })
  //   .update({ status })
  //   .returning('*');

  const result = await pgClient.query(
    `UPDATE ${ORDERS} SET status = $1 WHERE "orderNumber" = $2 RETURNING *`,
    [status, orderNumber],
  );

  return result.rows[0];
}

module.exports = client => {
  pgClient = client;

  return {
    createOrder,
    getOrder,
    getAllOrders,
    updateOrderStatus,
  };
};
