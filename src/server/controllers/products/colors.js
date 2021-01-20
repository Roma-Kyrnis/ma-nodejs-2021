const { colors } = require('../../../db');
const { throwIfInvalid } = require('../../../utils');
const getAndCheckId = require('../../../utils/getAndCheckId');

async function createColor(req, res) {
  throwIfInvalid(req.body.color, 400, 'No color defined');

  const result = await colors.createColor(req.body.color);

  res.status(200).json({ message: `Color id: ${result.id} created` });
}

async function getColor(req, res) {
  const id = getAndCheckId(req.params.id);

  const result = await colors.getColor(id);

  const message = result ? 'ok' : 'No such color';
  res.status(200).json({ message, color: result || {} });
}

async function getAllColors(req, res) {
  const result = await colors.getAllColors();

  res.status(200).json({ message: 'ok', colors: result });
}

async function getAllDeletedColors(req, res) {
  const result = await colors.getAllDeletedColors();

  res.status(200).json({ message: 'ok', colors: result });
}

async function updateColor(req, res) {
  const id = getAndCheckId(req.params.id);

  throwIfInvalid(req.body.color, 400, 'No color defined');

  await colors.updateColor({ id, color: req.body.color });

  res.status(200).json({ message: 'Color updated' });
}

async function deleteColor(req, res) {
  const id = getAndCheckId(req.params.id);

  await colors.deleteColor(id);

  res.status(200).json({ message: 'Color deleted' });
}

module.exports = {
  createColor,
  getColor,
  getAllColors,
  getAllDeletedColors,
  updateColor,
  deleteColor,
};
