const { products } = require('../db');

function throwIfInvalid(isValid, message) {
  if (isValid) {
    const err = new Error(`ERROR: ${message}`);
    err.status = 400;
    throw err;
  }

  return true;
}

async function createProduct({ body }) {
  throwIfInvalid(!Array.from(body).length, 'No body');

  const { type, color, price = 0, quantity = 1 } = body;

  throwIfInvalid(!type, 'No product type defined');
  throwIfInvalid(!color, 'No product color defined');

  const product = {
    type,
    color,
    price: parseInt(price, 10),
    quantity: parseInt(quantity, 10),
  };

  throwIfInvalid(Number.isNaN(product.price), 'Invalid price');
  throwIfInvalid(Number.isNaN(product.quantity), 'Invalid quantity');

  try {
    const res = await products.createProduct(product);

    console.log(`DEBUG: New product created: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    throw err;
  }
}

async function getProduct(req) {
  const { id } = req.params;

  throwIfInvalid(!id, 'No product id defined');

  try {
    const res = await products.getProduct(parseInt(id, 10));

    console.log(`DEBUG: Product is: ${JSON.stringify(res)}`);

    return res;
  } catch (err) {
    throw err;
  }
}

async function getAllProducts() {
  try {
    const res = await products.getAllProducts();

    console.log(`DEBUG: Products are: ${JSON.stringify(res)}`);

    return res;
  } catch (err) {
    throw err;
  }
}

async function updateProduct(req) {
  const product = { ...req.body, id: req.params.id };

  throwIfInvalid(!product.id, 'No product id defined');

  try {
    const res = await products.updateProduct(product);

    console.log(`DEBUG: Product updated: ${JSON.stringify(res)}`);

    return res;
  } catch (err) {
    throw err;
  }
}

async function deleteProduct(req) {
  const { id } = req.params;

  throwIfInvalid(!id, 'No product id defined');

  try {
    const res = await products.deleteProduct(parseInt(id, 10));

    return res;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
