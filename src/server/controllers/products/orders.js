const { validate: uuidValidate, version: uuidVersion } = require('uuid');

const { products, orders } = require('../../../db');
const { countDeliveryPrice } = require('../../../services');
const { throwIfInvalid } = require('../../../utils');
const {
  orders: { STATUSES },
} = require('../../../config');

const uuidValidateV4 = uuid => uuidValidate(uuid) && uuidVersion(uuid) === 4;
const checkOrderNumber = order => {
  throwIfInvalid(uuidValidateV4(order), 400, 'Incorrect orderNumber');
};

const getOrderProduct = body => {
  const orderProduct = {
    type: body.type,
    color: body.color,
    price: parseFloat(body.price || 0, 10),
    quantity: parseInt(body.quantity || 1, 10),
  };

  throwIfInvalid(orderProduct.type, 400, 'No product type defined');
  throwIfInvalid(orderProduct.color, 400, 'No product color defined');
  throwIfInvalid(!Number.isNaN(orderProduct.price), 400, 'Invalid price');
  throwIfInvalid(!Number.isNaN(orderProduct.quantity), 400, 'Invalid quantity');

  return orderProduct;
};

async function createOrder(req, res) {
  const orderProduct = getOrderProduct(req.body);
  const availableProduct = await products.getProductIdAndQuantity(orderProduct);

  throwIfInvalid(availableProduct, 400, 'No such product');
  throwIfInvalid(
    orderProduct.quantity <= availableProduct.quantity,
    400,
    `There are not so many product quantity. Available quantity: ${availableProduct.quantity}`,
  );

  const product = {
    id: availableProduct.id,
    quantity: availableProduct.quantity - orderProduct.quantity,
  };

  await products.updateProduct(product);

  const order = {
    productId: availableProduct.id,
    quantity: orderProduct.quantity,
  };

  const result = await orders.createOrder(order);

  res
    .status(200)
    .json({ message: 'Product ordered', orderNumber: result.orderNumber });
}

async function getOrder(req, res) {
  checkOrderNumber(req.params.orderNumber);

  const order = await orders.getOrder(req.params.orderNumber);

  res.status(200).json({ message: 'Ok', order });
}

async function getAllOrder(req, res) {
  const allOrders = await orders.getAllOrders();

  res.status(200).json({ message: 'Ok', orders: allOrders });
}

async function calculateOrder(req, res) {
  throwIfInvalid(req.body.recipientCity, 400, 'No recipientCity defined');
  checkOrderNumber(req.params.orderNumber);

  const currOrder = await orders.getOrder(req.params.orderNumber);
  throwIfInvalid(currOrder, 400, 'No such order');

  const order = {
    recipient: req.body.recipientCity,
    type: currOrder.type,
    price: parseFloat(currOrder.price, 10),
    quantity: parseInt(currOrder.quantity, 10),
  };

  const price = await countDeliveryPrice(order);

  res.status(200).json({ message: 'Price calculated', price });
}

async function updateOrderStatus(req, res) {
  throwIfInvalid(req.body.status, 400, 'No status defined');
  checkOrderNumber(req.params.orderNumber);

  const status = Object.values(STATUSES).find(
    value => value === req.body.status,
  );
  throwIfInvalid(status && status !== STATUSES.OPEN, 400, 'Incorrect status');

  const currOrder = await orders.getOrder(req.params.orderNumber);
  throwIfInvalid(currOrder, 400, 'No such order');
  throwIfInvalid(currOrder.status === STATUSES.OPEN, 400, 'Order is not open');

  if (status === STATUSES.CANCEL) {
    const product = await products.getProduct(currOrder.productId);

    await products.updateProduct({
      id: currOrder.productId,
      quantity: product.quantity + currOrder.quantity,
    });
  }

  await orders.updateOrderStatus({
    orderNumber: req.params.orderNumber,
    status,
  });

  res.status(200).json({ message: 'Order status changed' });
}

module.exports = {
  createOrder,
  getOrder,
  getAllOrder,
  calculateOrder,
  updateOrderStatus,
};
