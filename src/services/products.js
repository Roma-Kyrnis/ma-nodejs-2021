const { products } = require('../db');

async function createProduct(req) {
  const { type, color, price = 0, quantity = 1 } = req.body;

  if (!type) {
    const err = new Error('ERROR: No product type defined');
    err.status = 400;
    throw err;
  }
  if (!color) {
    const err = new Error('ERROR: No product color defined');
    err.status = 400;
    throw err;
  }

  const product = {
    type,
    color,
    price: parseInt(price, 10),
    quantity: parseInt(quantity, 10),
  };

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

  if (!id) {
    const err = new Error('ERROR: No product id defined');
    err.status = 400;
    throw err;
  }

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

  if (!product.id) {
    const err = new Error('ERROR: No product id defined');
    err.status = 400;
    throw err;
  }

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

  if (!id) {
    const err = new Error('ERROR: No product id defined');
    err.status = 400;
    throw err;
  }

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
