const {
  db: { config, defaultType },
} = require('../config');
const fatalError = require('../utils/fatalError');

const db = {};

let clientType = defaultType;

function funcWrapper(func) {
  if (typeof func === 'function') return func;

  return fatalError(
    `FATAL: Cannot find ${func.name || func} function for current DB wrapper`,
  );
}

async function init() {
  try {
    for await (const [k, v] of Object.entries(config)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const wrapper = require(`./${k}`)(v);

      await wrapper.testConnection();
      console.log(`INFO: DB wrapper for ${k} initiated`);
      await wrapper.createDBWithTables();

      db[k] = wrapper;
    }
  } catch (err) {
    fatalError(`FATAL: ${err.message || err}`);
  }
}

async function end() {
  for (const [k, v] of Object.entries(db)) {
    // eslint-disable-next-line no-await-in-loop
    await v.close();
    console.log(`INFO: DB wrapper for ${k} was closed`);
  }
}

function setClientType(t) {
  if (!t || !db[t]) {
    console.log('WARNING: Cannot find provided DB type');
    return false;
  }

  clientType = t;
  console.log(`INFO: The DB type has been changed to ${t}`);
  return true;
}

function getClientType() {
  return clientType;
}

function dbWrapper(t) {
  return db[t] || db[clientType];
}

async function testConnection() {
  return funcWrapper(dbWrapper().testConnection)();
}
async function close() {
  return funcWrapper(dbWrapper().close)();
}

// -----Products-------
async function createProduct(product) {
  return funcWrapper(dbWrapper().products.createProduct)(product);
}
async function getProduct(id) {
  return funcWrapper(dbWrapper().products.getProduct)(id);
}
async function getAllProducts() {
  return funcWrapper(dbWrapper().products.getAllProducts)();
}
async function updateProduct(product) {
  return funcWrapper(dbWrapper().products.updateProduct)(product);
}
async function deleteProduct(id) {
  return funcWrapper(dbWrapper().products.deleteProduct)(id);
}

// -----Types-------
async function createType(type) {
  return funcWrapper(dbWrapper().types.createType)(type);
}
async function getType(id) {
  return funcWrapper(dbWrapper().types.getType)(id);
}
async function getAllTypes() {
  return funcWrapper(dbWrapper().types.getAllTypes)();
}
async function updateType(type) {
  return funcWrapper(dbWrapper().types.updateType)(type);
}
async function deleteType(id) {
  return funcWrapper(dbWrapper().types.deleteType)(id);
}

// -----Colors-------
async function createColor(color) {
  return funcWrapper(dbWrapper().colors.createColor)(color);
}
async function getColor(id) {
  return funcWrapper(dbWrapper().colors.getColor)(id);
}
async function getAllColors() {
  return funcWrapper(dbWrapper().colors.getAllColors)();
}
async function updateColor(color) {
  return funcWrapper(dbWrapper().colors.updateColor)(color);
}
async function deleteColor(id) {
  return funcWrapper(dbWrapper().colors.deleteColor)(id);
}

module.exports = {
  init,
  end,
  setClientType,
  getClientType,
  dbWrapper,
  // ------------------------------

  testConnection,
  close,

  products: {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
  },

  types: {
    createType,
    getType,
    getAllTypes,
    updateType,
    deleteType,
  },

  colors: {
    createColor,
    getColor,
    getAllColors,
    updateColor,
    deleteColor,
  },
};
