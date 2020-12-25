const createError = require('http-errors');

const { products } = require('../../services');

async function createProduct(req, res, next) {
  try {
    const result = await products.createProduct(req);
    res.status(200).json({ message: `Product id: ${result.id} created` });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function getProduct(req, res, next) {
  try {
    const result = await products.getProduct(req);

    res.status(200).json({ message: 'ok', product: result });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function getAllProducts(req, res, next) {
  try {
    const result = await products.getAllProducts();

    res.status(200).json({ message: 'ok', products: result });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function updateProduct(req, res, next) {
  try {
    await products.updateProduct(req);
    res.status(200).json({ message: 'Product updated' });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function deleteProduct(req, res, next) {
  try {
    await products.deleteProduct(req);
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
