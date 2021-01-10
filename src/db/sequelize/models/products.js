/* eslint-disable no-unused-vars */
const {
  tables: { PRODUCTS, TYPES, COLORS },
} = require('../../../config');

function up(sequelize, DataTypes) {
  return sequelize.define(
    PRODUCTS,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      typeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: TYPES,
          key: 'id',
        },
      },
      colorId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: COLORS,
          key: 'id',
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        unique: true,
        defaultValue: 0.0,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
