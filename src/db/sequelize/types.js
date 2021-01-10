const { Sequelize } = require('sequelize');

const {
  tables: { TYPES },
} = require('../../config');
const { throwIfInvalid } = require('../../utils');

let sequelize;

async function createType(type) {
  const result = await sequelize[TYPES].findCreateFind({
    where: { type },
  });

  return result[0];
}

async function getType(id) {
  return await sequelize[TYPES].findOne({
    where: {
      id,
      deletedAt: { [Sequelize.Op.is]: null },
    },
  });
}

async function getAllTypes() {
  return await sequelize[TYPES].findAll({
    where: { deletedAt: { [Sequelize.Op.is]: null } },
  });
}

async function updateType({ id, ...type }) {
  try {
    const res = await sequelize[TYPES].update(type, {
      where: { id },
      returning: true,
    });

    return res[1][0];
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(!err, 400, 'Table already has this type');
  }
}

async function deleteType(id) {
  await sequelize[TYPES].update({ deletedAt: Date.now() }, { where: { id } });

  return true;
}

module.exports = client => {
  sequelize = client;

  return {
    createType,
    getType,
    getAllTypes,
    updateType,
    deleteType,
  };
};
