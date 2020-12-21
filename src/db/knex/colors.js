const {
  tables: { COLORS },
} = require('../../config');

const { throwIfInvalid } = require('../../utils');

let knex;

async function createColor(color) {
  try {
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
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getColor(id) {
  try {
    console.log({ id });

    const [res] = await knex(COLORS)
      .where({ id, deleted_at: null })
      .select('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllColors() {
  try {
    const res = await knex(COLORS).where({ deleted_at: null }).select('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateColor({ id, color }) {
  const timestamp = new Date();

  try {
    const [res] = await knex(COLORS)
      .where({ id })
      .update({ color, updated_at: timestamp })
      .returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(
      !err,
      400,
      'Cannot update, table already has this color',
    );
  }
}

async function deleteColor(id) {
  try {
    await knex(COLORS).where({ id }).update({ deleted_at: new Date() });

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
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
