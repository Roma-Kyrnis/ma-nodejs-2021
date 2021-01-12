/* eslint-disable no-unused-vars */

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable(
    'admins',
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      hash: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      'refresh-token': {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
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
  await queryInterface.dropTable('admins');
}

module.exports = { up, down };
