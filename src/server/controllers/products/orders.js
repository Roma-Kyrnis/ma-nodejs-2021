const { validate: uuidValidate, version: uuidVersion } = require('uuid');

const { products, orders } = require('../../../db');
const { countDeliveryPrice } = require('../../../services');
const { throwIfInvalid } = require('../../../utils');

const uuidValidateV4 = uuid => uuidValidate(uuid) && uuidVersion(uuid) === 4;

async function createOrder(req, res) {
  throwIfInvalid(req.body !== null, 400, 'No body');

  const orderProduct = {
    type: req.body.type,
    color: req.body.color,
    price: parseInt(req.body.price || 0, 10),
    quantity: parseInt(req.body.quantity || 1, 10),
  };

  throwIfInvalid(orderProduct.type, 400, 'No product type defined');
  throwIfInvalid(orderProduct.color, 400, 'No product color defined');
  throwIfInvalid(!Number.isNaN(orderProduct.price), 400, 'Invalid price');
  throwIfInvalid(!Number.isNaN(orderProduct.quantity), 400, 'Invalid quantity');

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

async function calculateOrder(req, res) {
  throwIfInvalid(req.body.recipientCity, 400, 'No recipientCity defined');
  throwIfInvalid(
    uuidValidateV4(req.params.orderNumber),
    400,
    'Incorrect orderNumber',
  );

  const product = await orders.getOrder(req.params.orderNumber);
  throwIfInvalid(product, 400, 'No such order');

  const order = {
    recipient: req.body.recipientCity,
    typ: product.type,
    price: parseInt(product.price, 10),
    quantity: parseInt(product.quantity, 10),
  };

  const price = await countDeliveryPrice(order);

  res.status(200).json({ message: 'Price calculated', price });
}

async function changeOrderStatus(req, res) {
  

  res.status(200).json({ message: 'Order status changed' });

}

module.exports = { createOrder, calculateOrder };
