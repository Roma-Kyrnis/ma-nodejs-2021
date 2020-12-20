const createError = require('http-errors');

const {
  products: { types },
} = require('../../../services');

async function createType(req, res, next) {
  try {
    const result = await types.createType(req);
    res.status(200).json({ message: `Type id: ${result.id} created` });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function getType(req, res, next) {
  try {
    const result = await types.getType(req);

    res.status(200).json({ message: 'ok', product: result });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function getAllTypes(req, res, next) {
  try {
    const result = await types.getAllTypes();

    res.status(200).json({ message: 'ok', products: result });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function updateType(req, res, next) {
  try {
    await types.updateType(req);
    res.status(200).json({ message: 'Type updated' });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function deleteType(req, res, next) {
  try {
    await types.deleteType(req);
    res.status(200).json({ message: 'Type deleted' });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

module.exports = {
  createType,
  getType,
  getAllTypes,
  updateType,
  deleteType,
};
