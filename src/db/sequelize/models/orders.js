/* eslint-disable no-unused-vars */
const Sequelize = require('sequelize');

const {
  tables: { ORDERS },
} = require('../../../config');

function up(sequelize, DataTypes) {
  return sequelize.define(
    ORDERS,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      orderNumber: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
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
