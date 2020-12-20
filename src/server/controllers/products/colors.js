const createError = require('http-errors');

const {
  products: { colors },
} = require('../../../services');

async function createColor(req, res, next) {
  try {
    const result = await colors.createColor(req);
    res.status(200).json({ message: `Color id: ${result.id} created` });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function getColor(req, res, next) {
  try {
    const result = await colors.getColor(req);

    res.status(200).json({ message: 'ok', product: result });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function getAllColors(req, res, next) {
  try {
    const result = await colors.getAllColors();

    res.status(200).json({ message: 'ok', products: result });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function updateColor(req, res, next) {
  try {
    await colors.updateColor(req);
    res.status(200).json({ message: 'Color updated' });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

async function deleteColor(req, res, next) {
  try {
    await colors.deleteColor(req);
    res.status(200).json({ message: 'Color deleted' });
  } catch (err) {
    next(createError(err.status || 500, err.message || ''));
  }
}

module.exports = {
  createColor,
  getColor,
  getAllColors,
  updateColor,
  deleteColor,
};
