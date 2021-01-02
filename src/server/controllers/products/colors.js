const { colors } = require('../../../db');
const { throwIfInvalid } = require('../../../utils');

async function createColor(req, res) {
  throwIfInvalid(req.body !== null, 400, 'No body');
  throwIfInvalid(req.body.color, 400, 'No color defined');

  const result = await colors.createColor(req.body.color);

  res.status(200).json({ message: `Color id: ${result.id} created` });
}

async function getColor(req, res) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No color id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  const result = await colors.getColor(id);

  res.status(200).json({ message: 'ok', product: result });
}

async function getAllColors(req, res) {
  const result = await colors.getAllColors();

  res.status(200).json({ message: 'ok', products: result });
}

async function updateColor(req, res) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No color id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');
  throwIfInvalid(req.body.color, 400, 'No color defined');

  await colors.updateColor({ id, color: req.body.color });

  res.status(200).json({ message: 'Color updated' });
}

async function deleteColor(req, res) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No color id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  await colors.deleteColor(id);

  res.status(200).json({ message: 'Color deleted' });
}

module.exports = {
  createColor,
  getColor,
  getAllColors,
  updateColor,
  deleteColor,
};
