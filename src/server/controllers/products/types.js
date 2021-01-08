const { types } = require('../../../db');
const { throwIfInvalid } = require('../../../utils');

async function createType(req, res) {
  throwIfInvalid(req.body.type, 400, 'No type defined');

  const result = await types.createType(req.body.type);

  res.status(200).json({ message: `Type id: ${result.id} created` });
}

async function getType(req, res) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No type id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  const result = await types.getType(id);

  res.status(200).json({ message: 'ok', product: result });
}

async function getAllTypes(req, res) {
  const result = await types.getAllTypes();

  res.status(200).json({ message: 'ok', products: result });
}

async function updateType(req, res) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No type id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');
  throwIfInvalid(req.body.type, 400, 'No type defined');

  await types.updateType({ id, type: req.body.type });

  res.status(200).json({ message: 'Type updated' });
}

async function deleteType(req, res) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No type id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  await types.deleteType(id);

  res.status(200).json({ message: 'Type deleted' });
}

module.exports = {
  createType,
  getType,
  getAllTypes,
  updateType,
  deleteType,
};