/* eslint-disable no-unused-vars */
const {
  tables: { COLORS },
} = require('../../../config');

function up(sequelize, DataTypes) {
  return sequelize.define(
    COLORS,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      color: {
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
