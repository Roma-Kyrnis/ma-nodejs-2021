const path = require('path');
const { readdirSync } = require('fs');

const Sequelize = require('sequelize');

const modelsDirectory = path.join(__dirname, './models');

const {
  db: {
    names: { SEQUELIZE },
  },
} = require('../../config');
const { throwIfInvalid } = require('../../utils');

const dbAdmins = require('./admins');
const dbProducts = require('./products');
const dbTypes = require('./types');
const dbColors = require('./colors');

let database;
let sequelize;
const db = {};

async function createDBIfNotExists() {
  await sequelize.query(`SELECT 'CREATE DATABASE ${database}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${database}')`);
}

async function testConnection() {
  console.log(`Hello from ${SEQUELIZE} testConnection`);

  await sequelize.authenticate();
}

async function close() {
  console.log(`INFO: Closing ${SEQUELIZE} DB wrapper`);

  await sequelize.close();
}

module.exports = config => {
  throwIfInvalid(config, 500, 'No config!');

  throwIfInvalid(config.database, 500, 'Undefined database');
  database = config.database;

  sequelize = new Sequelize(config);

  readdirSync(modelsDirectory)
    .filter(file => {
      return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
    })
    .forEach(file => {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const model = require(path.join(modelsDirectory, file))(
        sequelize,
        Sequelize.DataTypes,
      );
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  const admins = dbAdmins(db);
  const products = dbProducts(db);
  const types = dbTypes(db);
  const colors = dbColors(db);

  return {
    createDBIfNotExists,
    testConnection,
    close,

    // --------------

    admins,
    products,
    types,
    colors,
  };
};
