const { products } = require('../../../db');
const { throwIfInvalid } = require('../../../utils');
const getAndCheckId = require('../../../utils/getAndCheckId');

const types = require('./types');
const colors = require('./colors');

async function createProduct(req, res) {
  const product = {
    type: req.body.type,
    color: req.body.color,
    price: parseFloat(req.body.price || 0, 10),
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
  const id = getAndCheckId(req.params.id);

  const result = await products.getProduct(id);

  const message = result ? 'ok' : 'No such product';
  res.status(200).json({ message, product: result || {} });
}

async function getAllProducts(req, res) {
  const result = await products.getAllProducts();

  res.status(200).json({ message: 'ok', products: result });
}

async function getAllDeletedProducts(req, res) {
  const result = await products.getAllDeletedProducts();

  res.status(200).json({ message: 'ok', deleted_products: result });
}

async function updateProduct(req, res) {
  const product = { ...req.body };
  product.id = getAndCheckId(req.params.id);

  await products.updateProduct(product);

  res.status(200).json({ message: 'Product updated' });
}

async function deleteProduct(req, res) {
  const id = getAndCheckId(req.params.id);

  await products.deleteProduct(id);

  res.status(200).json({ message: 'Product deleted' });
}

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  getAllDeletedProducts,
  updateProduct,
  deleteProduct,

  // Types
  types,

  // Colors
  colors,
};
