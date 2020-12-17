const { products } = require('../db');

const { throwIfInvalid } = require('../utils');

async function createProduct({ body }) {
  throwIfInvalid(!Array.from(body).length, 400, 'No body');

  const { type, color, price = 0, quantity = 1 } = body;

  throwIfInvalid(!type, 400, 'No product type defined');
  throwIfInvalid(!color, 400, 'No product color defined');

  const product = {
    type,
    color,
    price: parseInt(price, 10),
    quantity: parseInt(quantity, 10),
  };

  throwIfInvalid(Number.isNaN(product.price), 400, 'Invalid price');
  throwIfInvalid(Number.isNaN(product.quantity), 400, 'Invalid quantity');

  const res = await products.createProduct(product);

  console.log(`DEBUG: New product created: ${JSON.stringify(res)}`);
  return res;
}

async function getProduct(req) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(!id, 400, 'No product id defined');
  throwIfInvalid(Number.isNaN(id), 400, 'Incorrect id');

  const res = await products.getProduct(id);

  console.log(`DEBUG: Product is: ${JSON.stringify(res)}`);

  return res;
}

async function getAllProducts() {
  const res = await products.getAllProducts();

  console.log(`DEBUG: Products are: ${JSON.stringify(res)}`);

  return res;
}

async function updateProduct(req) {
  const product = { ...req.body, id: req.params.id };

  throwIfInvalid(!product.id, 400, 'No product id defined');

  const res = await products.updateProduct(product);

  console.log(`DEBUG: Product updated: ${JSON.stringify(res)}`);

  return res;
}

async function deleteProduct(req) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(!id, 400, 'No product id defined');
  throwIfInvalid(Number.isNaN(id), 400, 'Incorrect id');

  const res = await products.deleteProduct(id);

  return res;
}

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
