const { products } = require('../../../db');
const { throwIfInvalid } = require('../../../utils');

const types = require('./types');
const colors = require('./colors');
const orders = require('./orders');

async function createProduct(req, res) {
  throwIfInvalid(req.body !== null, 400, 'No body');

  const product = {
    type: req.body.type,
    color: req.body.color,
    price: parseInt(req.body.price || 0, 10),
    quantity: parseInt(req.body.quantity || 1, 10),
  };

  throwIfInvalid(product.type, 400, 'No product type defined');
  throwIfInvalid(product.color, 400, 'No product color defined');
  throwIfInvalid(!Number.isNaN(product.price), 400, 'Invalid price');
  throwIfInvalid(!Number.isNaN(product.quantity), 400, 'Invalid quantity');

  const result = await products.createProduct(product);

  res.status(200).json({ message: `Product id: ${result.id} created` });
}

async function getProduct(req, res) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No product id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  const result = await products.getProduct(id);

  res.status(200).json({ message: 'ok', product: result });
}

async function getAllProducts(req, res) {
  const result = await products.getAllProducts();

  res.status(200).json({ message: 'ok', products: result });
}

async function updateProduct(req, res) {
  const product = { ...req.body, id: parseInt(req.params.id, 10) };

  throwIfInvalid(product.id, 400, 'No product id defined');
  throwIfInvalid(!Number.isNaN(product.id), 400, 'Incorrect id');

  await products.updateProduct(product);

  res.status(200).json({ message: 'Product updated' });
}

async function deleteProduct(req, res) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No product id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  await products.deleteProduct(id);

  res.status(200).json({ message: 'Product deleted' });
}

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,

  // Types
  types,

  // Colors
  colors,

  // Orders
  orders,
};
