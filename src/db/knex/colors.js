const {
  tables: { COLORS },
} = require('../../config');

const { throwIfInvalid } = require('../../utils');

let knex;

async function createColor(color) {
  const timestamp = new Date();

  const [res] = await knex(COLORS)
    .insert({
      color,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .returning('id')
    .onConflict('color')
    .merge()
    .returning('id');

  return res;
}

async function getColor(id) {
  return await knex(COLORS).where({ id, deleted_at: null }).first();
}

async function getAllColors() {
  return await knex(COLORS).where({ deleted_at: null });
}

async function updateColor({ id, ...color }) {
  try {
    const [res] = await knex(COLORS)
      .where({ id })
      .update({ ...color, updated_at: new Date() })
      .returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(!err, 400, 'Table already has this color');
  }
}

async function deleteColor(id) {
  await knex(COLORS).where({ id }).update({ deleted_at: new Date() });

  return true;
}

module.exports = client => {
  knex = client;

  return {
    createColor,
    getColor,
    getAllColors,
    updateColor,
    deleteColor,
  };
};
