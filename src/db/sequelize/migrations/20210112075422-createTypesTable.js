/* eslint-disable no-unused-vars */

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable(
    'types',
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
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
  await queryInterface.dropTable('types');
}

module.exports = { up, down };
