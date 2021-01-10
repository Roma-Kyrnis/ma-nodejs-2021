const { Sequelize } = require('sequelize');

const {
  tables: { COLORS },
} = require('../../config');
const { throwIfInvalid } = require('../../utils');

let sequelize;

async function createColor(color) {
  const result = await sequelize[COLORS].findCreateFind({
    where: { color },
  });

  return result[0];
}

async function getColor(id) {
  return await sequelize[COLORS].findOne({
    where: {
      id,
      deletedAt: { [Sequelize.Op.is]: null },
    },
  });
}

async function getAllColors() {
  return await sequelize[COLORS].findAll({
    where: { deletedAt: { [Sequelize.Op.is]: null } },
  });
}

async function updateColor({ id, ...color }) {
  try {
    const res = await sequelize[COLORS].update(color, {
      where: { id },
      returning: true,
    });

    return res[1][0];
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(!err, 400, 'Table already has this type');
  }
}

async function deleteColor(id) {
  await sequelize[COLORS].update({ deletedAt: Date.now() }, { where: { id } });

  return true;
}

module.exports = client => {
  sequelize = client;

  return {
    createColor,
    getColor,
    getAllColors,
    updateColor,
    deleteColor,
  };
};
