const {
  tables: { TYPES },
} = require('../../config');

const { throwIfInvalid } = require('../../utils');

let knex;

async function createType(type) {
  const timestamp = new Date();

  const [res] = await knex(TYPES)
    .insert({
      type,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .returning('*')
    .onConflict('type')
    .merge()
    .returning('*');

  return res;
}

async function getType(id) {
  return await knex(TYPES).where({ id, deleted_at: null }).first();
}

async function getAllTypes() {
  return await knex(TYPES).where({ deleted_at: null });
}

async function updateType({ id, ...type }) {
  try {
    const [res] = await knex(TYPES)
      .where({ id })
      .update({ ...type, updated_at: new Date() })
      .returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(!err, 400, 'Table already has this type');
  }
}

async function deleteType(id) {
  await knex(TYPES).where({ id }).update({ deleted_at: new Date() });

  return true;
}

module.exports = client => {
  knex = client;

  return {
    createType,
    getType,
    getAllTypes,
    updateType,
    deleteType,
  };
};
