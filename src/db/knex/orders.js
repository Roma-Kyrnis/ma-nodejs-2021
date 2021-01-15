const {
  tables: { ORDERS, PRODUCTS, TYPES, COLORS },
  orders: {
    STATUSES: { OPEN },
  },
} = require('../../config');

let knex;

async function createOrder({ productId, quantity = 1 }) {
  const timestamp = new Date();

  const [order] = await knex(ORDERS)
    .insert({
      productId,
      quantity,
      status: OPEN,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .returning('*');

  return order;
}

async function getOrder(orderNumber) {
  return await knex(ORDERS)
    .where(`${ORDERS}.orderNumber`, orderNumber)
    .join(PRODUCTS, `${ORDERS}.productId`, '=', `${PRODUCTS}.id`)
    .join(TYPES, `${PRODUCTS}.typeId`, '=', `${TYPES}.id`)
    .join(COLORS, `${PRODUCTS}.colorId`, '=', `${COLORS}.id`)
    .select(
      `${ORDERS}.id`,
      `${ORDERS}.status`,
      `${ORDERS}.productId`,
      `${ORDERS}.quantity`,
      `${TYPES}.type`,
      `${COLORS}.color`,
      `${PRODUCTS}.price`,
    )
    .first();
}

async function getAllOrders() {
  return await knex(ORDERS).select(`id`, `status`, `productId`, `quantity`);
}

async function updateOrderStatus({ orderNumber, status }) {
  const [res] = await knex(ORDERS)
    .where({ orderNumber })
    .update({ status })
    .returning('*');

  return res;
}

module.exports = client => {
  knex = client;

  return {
    createOrder,
    getOrder,
    getAllOrders,
    updateOrderStatus,
  };
};
