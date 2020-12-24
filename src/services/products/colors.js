const { colors } = require('../../db');

const { throwIfInvalid } = require('../../utils');

async function createColor({ body }) {
  throwIfInvalid(Object.keys(body).toString(), 400, 'No body');

  const { color } = body;

  throwIfInvalid(color, 400, 'No color defined');

  const res = await colors.createColor(color);

  console.log(`DEBUG: New color created: ${JSON.stringify(res)}`);
  return res;
}

async function getColor(req) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No color id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  const res = await colors.getColor(id);

  console.log(`DEBUG: Color is: ${JSON.stringify(res)}`);

  return res;
}

async function getAllColors() {
  const res = await colors.getAllColors();

  console.log(`DEBUG: Colors are: ${JSON.stringify(res)}`);

  return res;
}

async function updateColor(req) {
  const id = parseInt(req.params.id, 10);
  const { color } = req.body;

  throwIfInvalid(id, 400, 'No color id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');
  throwIfInvalid(color, 400, 'No color defined');

  const res = await colors.updateColor({ id, color });

  console.log(`DEBUG: Color updated: ${JSON.stringify(res)}`);

  return res;
}

async function deleteColor(req) {
  const id = parseInt(req.params.id, 10);

  throwIfInvalid(id, 400, 'No color id defined');
  throwIfInvalid(!Number.isNaN(id), 400, 'Incorrect id');

  const res = await colors.deleteColor(id);

  return res;
}

module.exports = {
  createColor,
  getColor,
  getAllColors,
  updateColor,
  deleteColor,
};
