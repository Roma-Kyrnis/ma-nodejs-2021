const {
  tables: { ADMINS },
} = require('../../config');

const { throwIfInvalid } = require('../../utils');

let knex;

async function createAdmins(admins) {
  try {
    const timestamp = new Date();
    const adminsWithTime = admins.map(value => ({
      ...value,
      created_at: timestamp,
      updated_at: timestamp,
    }));

    return await knex(ADMINS)
      .insert(adminsWithTime)
      .returning('*')
      .onConflict(['hash', 'name'])
      .merge()
      .returning('*')[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getType(id) {
  try {
    console.log({ id });

    const [res] = await knex(TYPES).where({ id, deleted_at: null }).select('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllTypes() {
  try {
    const res = await knex(TYPES).where({ deleted_at: null }).select('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateType({ id, type }) {
  const timestamp = new Date();

  try {
    const [res] = await knex(TYPES)
      .where({ id })
      .update({ type, updated_at: timestamp })
      .returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(
      !err,
      400,
      'Cannot update, table already has this type',
    );
  }
}

async function deleteType(id) {
  try {
    await knex(TYPES).where({ id }).update({ deleted_at: new Date() });

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
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
