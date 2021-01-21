/* eslint-disable no-unused-vars */
const {
  tables: { ADMINS },
} = require('../../../config');

function up(sequelize, DataTypes) {
  return sequelize.define(
    ADMINS,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      'refresh-token': {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
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
