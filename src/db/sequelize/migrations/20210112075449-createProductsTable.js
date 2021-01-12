/* eslint-disable no-unused-vars */

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable(
    'products',
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      typeId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'types',
          key: 'id',
        },
      },
      colorId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'colors',
          key: 'id',
        },
      },
      price: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: true,
        defaultValue: 0.0,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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

async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('products');
}

module.exports = { up, down };
