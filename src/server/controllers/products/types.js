const { types } = require('../../../db');
const { throwIfInvalid } = require('../../../utils');
const getAndCheckId = require('../../../utils/getAndCheckId');

async function createType(req, res) {
  throwIfInvalid(req.body.type, 400, 'No type defined');

  const result = await types.createType(req.body.type);

  res.status(200).json({ message: 'Type created', id: result.id });
}

async function getType(req, res) {
  const id = getAndCheckId(req.params.id);

  const result = await types.getType(id);

  const message = result ? 'ok' : 'No such type';
  res.status(200).json({ message, type: result || {} });
}

async function getAllTypes(req, res) {
  const result = await types.getAllTypes();

  res.status(200).json({ message: 'ok', types: result });
}

async function updateType(req, res) {
  const id = getAndCheckId(req.params.id);

  throwIfInvalid(req.body.type, 400, 'No type defined');

  await types.updateType({ id, type: req.body.type });

  res.status(200).json({ message: 'Type updated' });
}

async function deleteType(req, res) {
  const id = getAndCheckId(req.params.id);

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
