const {
  tables: { ORDERS, PRODUCTS, TYPES, COLORS },
  orders: {
    STATUSES: { OPEN },
  },
} = require('../../config');

let sequelize;

async function createOrder({ productId, quantity = 1 }) {
  const order = { productId, quantity, status: OPEN };
  return await sequelize[ORDERS].create(order);
}

async function getOrder(orderNumber) {
  await sequelize[PRODUCTS].belongsTo(sequelize[TYPES]);
  await sequelize[PRODUCTS].belongsTo(sequelize[COLORS]);
  await sequelize[ORDERS].belongsTo(sequelize[PRODUCTS]);

  const res = await sequelize[ORDERS].findOne({
    where: { orderNumber },
    include: [
      {
        model: sequelize[PRODUCTS],
        include: [
          {
            model: sequelize[TYPES],
            required: true,
          },
          {
            model: sequelize[COLORS],
            required: true,
          },
        ],
        required: true,
      },
    ],
  });

  return {
    id: res.id,
    status: res.status,
    productId: res.productId,
    quantity: res.quantity,
    type: res.product.type.type,
    color: res.product.color.color,
    price: res.product.price,
  };
}

async function getAllOrders() {
  return await sequelize[ORDERS].findAll({
    attributes: ['id', 'status', 'productId', 'quantity'],
  });
  // return await knex(ORDERS).select(`id`, `status`, `productId`, `quantity`);
}

async function updateOrderStatus({ orderNumber, status }) {
  return await sequelize[ORDERS].update(
    { status },
    { where: { orderNumber }, returning: true },
  );
}

module.exports = client => {
  sequelize = client;

  return {
    createOrder,
    getOrder,
    getAllOrders,
    updateOrderStatus,
  };
};
