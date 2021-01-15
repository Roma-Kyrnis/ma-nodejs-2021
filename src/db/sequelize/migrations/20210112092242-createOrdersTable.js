/* eslint-disable no-unused-vars */

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable(
    'orders',
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
      },
      orderNumber: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDv4,
        allowNull: false,
        primaryKey: true,
      },
      productId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {},
  );
}

async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('orders');
}

module.exports = { up, down };
