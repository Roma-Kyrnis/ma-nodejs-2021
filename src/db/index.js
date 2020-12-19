const {
  db: { config, defaultType },
} = require('../config');
const fatalError = require('../utils/fatalError');

const db = {};

let type = defaultType;

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

function setType(t) {
  if (!t || !db[t]) {
    console.log('WARNING: Cannot find provided DB type');
    return false;
  }

  type = t;
  console.log(`INFO: The DB type has been changed to ${t}`);
  return true;
}

function getType() {
  return type;
}

function dbWrapper(t) {
  return db[t] || db[type];
}

async function testConnection() {
  return funcWrapper(dbWrapper().testConnection)();
}
async function close() {
  return funcWrapper(dbWrapper().close)();
}
async function createProduct(product) {
  return funcWrapper(dbWrapper().createProduct)(product);
}
async function getProduct(id) {
  return funcWrapper(dbWrapper().getProduct)(id);
}
async function getAllProducts() {
  return funcWrapper(dbWrapper().getAllProducts)();
}
async function updateProduct(product) {
  return funcWrapper(dbWrapper().updateProduct)(product);
}
async function deleteProduct(id) {
  return funcWrapper(dbWrapper().deleteProduct)(id);
}

module.exports = {
  init,
  end,
  setType,
  getType,
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
};
