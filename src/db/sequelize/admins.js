const {
  tables: { ADMINS },
} = require('../../config');

let sequelize;

async function createAdmins(admins) {
  return await sequelize[ADMINS].bulkCreate(admins, { ignoreDuplicates: true });
}

async function getAdminRefreshToken({ name }) {
  return await sequelize[ADMINS].findOne(
    { where: { name } },
    { attributes: 'refresh-token' },
  );
}

async function updateAdminRefreshToken({ hash, name, refreshToken }) {
  const where = hash ? { hash } : { name };

  await sequelize[ADMINS].update(
    { 'refresh-token': refreshToken },
    { where, returning: true },
  );

  return true;
}

module.exports = client => {
  sequelize = client;

  return {
    createAdmins,
    getAdminRefreshToken,
    updateAdminRefreshToken,
  };
};
