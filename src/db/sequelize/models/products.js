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
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: TYPES,
          key: 'id',
        },
      },
      colorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: COLORS,
          key: 'id',
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: true,
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
    {
      indexes: [
        {
          unique: true,
          fields: ['typeId', 'colorId', 'price'],
        },
      ],
    },
  );
}

module.exports = up;
