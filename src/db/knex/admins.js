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

async function getAdminRefreshToken({ name }) {
  return await knex(ADMINS).where({ name }).select('refresh-token').first();
}

async function updateAdminRefreshToken({ hash, name, refreshToken }) {
  await knex(ADMINS)
    .where(builder => {
      if (hash) return builder.where({ hash });

      return builder.where({ name });
    })
    .update({ 'refresh-token': refreshToken, updated_at: new Date() });

  return true;
}

module.exports = client => {
  knex = client;

  return {
    createAdmins,
    getAdminRefreshToken,
    updateAdminRefreshToken,
  };
};
