const {
  tables: { ADMINS },
} = require('../../config');

let knex;

async function createAdmins(admins) {
  const timestamp = new Date();
  const adminsWithTime = admins.map(value => ({
    ...value,
    created_at: timestamp,
    updated_at: timestamp,
  }));

  return await knex(ADMINS)
    .insert(adminsWithTime)
    .returning('*')
    .onConflict('name')
    .merge()
    .returning('*');
}

// async function getAdmin(hash) {
//   return await knex(ADMINS)
//     .where({ hash, deleted_at: null })
//     .select('*')
//     .first();
// }

// async function getAllTypes() {
//   try {
//     const res = await knex(TYPES).where({ deleted_at: null }).select('*');

//     return res;
//   } catch (err) {
//     console.error(err.message || err);
//     throw err;
//   }
// }

async function updateAdmin({ hash, refreshToken }) {
  const [res] = await knex(ADMINS)
    .where({ hash })
    .update({ 'refresh-token': refreshToken, updated_at: new Date() })
    .returning('*');
  return res;
}

// async function deleteType(id) {
//   try {
//     await knex(TYPES).where({ id }).update({ deleted_at: new Date() });

//     return true;
//   } catch (err) {
//     console.error(err.message || err);
//     throw err;
//   }
// }

module.exports = client => {
  knex = client;

  return {
    createAdmins,
    // getAdmin,
    // getAllTypes,
    updateAdmin,
    // deleteType,
  };
};
