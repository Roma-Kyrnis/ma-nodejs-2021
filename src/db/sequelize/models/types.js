/* eslint-disable no-unused-vars */
const {
  tables: { TYPES },
} = require('../../../config');

function up(sequelize, DataTypes) {
  return sequelize.define(
    TYPES,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {},
  );
}

module.exports = up;
