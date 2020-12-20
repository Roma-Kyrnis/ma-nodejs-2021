const { types } = require('../../db');

const { throwIfInvalid } = require('../../utils');

async function createType({ body }) {
  throwIfInvalid(body !== null, 400, 'No body');

  const { type } = body;

  throwIfInvalid(type, 400, 'No type defined');

  const res = await types.createType(type);

  console.log(`DEBUG: New type created: ${JSON.stringify(res)}`);
  return res;
}

async function getType(req) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No type id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  const res = await types.getType(id);

  console.log(`DEBUG: Type is: ${JSON.stringify(res)}`);

  return res;
}

async function getAllTypes() {
  const res = await types.getAllTypes();

  console.log(`DEBUG: Types are: ${JSON.stringify(res)}`);

  return res;
}

async function updateType(req) {
  const id = parseInt(req.params.id, 10);
  const { type } = req.body;

  throwIfInvalid(id, 400, 'No type id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');
  throwIfInvalid(type, 400, 'No type defined');

  const res = await types.updateType({ id, type });

  console.log(`DEBUG: Type updated: ${JSON.stringify(res)}`);

  return res;
}

async function deleteType(req) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No type id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  const res = await types.deleteType(id);

  return res;
}

module.exports = {
  createType,
  getType,
  getAllTypes,
  updateType,
  deleteType,
};
