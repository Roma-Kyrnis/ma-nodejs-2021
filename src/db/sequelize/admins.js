const {
  Sequelize: { Op },
} = require('sequelize');

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
  await sequelize[ADMINS].update(
    { 'refresh-token': refreshToken },
    {
      where: {
        [Op.or]: [{ hash: hash || null }, { name: name || null }],
      },
      returning: true,
    },
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
