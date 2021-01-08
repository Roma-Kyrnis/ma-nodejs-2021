const {
  db: { config, defaultType },
  defaultAdmins,
} = require('../config');
const { createAdminHash } = require('../utils');
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

      db[k] = wrapper;
    }

    await db[clientType].createDBIfNotExists();

    const admins = defaultAdmins.map(admin => ({
      hash: createAdminHash(admin.username, admin.password),
      name: admin.username,
    }));

    await db[clientType].admins.createAdmins(admins);
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

function testConnection() {
  return funcWrapper(dbWrapper().testConnection)();
}
function close() {
  return funcWrapper(dbWrapper().close)();
}

// -----Admins-------
function createAdmins(admins) {
  return funcWrapper(dbWrapper().admins.createAdmins)(admins);
}
function getAdminRefreshToken(hash) {
  return funcWrapper(dbWrapper().admins.getAdminRefreshToken)(hash);
}
function updateAdminRefreshToken(admin) {
  return funcWrapper(dbWrapper().admins.updateAdminRefreshToken)(admin);
}

// -----Products-------
function createProduct(product) {
  return funcWrapper(dbWrapper().products.createProduct)(product);
}
function getProduct(id) {
  return funcWrapper(dbWrapper().products.getProduct)(id);
}
function getAllProducts() {
  return funcWrapper(dbWrapper().products.getAllProducts)();
}
function getProductIdAndQuantity(product) {
  return funcWrapper(dbWrapper().products.getProductIdAndQuantity)(product);
}
function getAllDeletedProducts() {
  return funcWrapper(dbWrapper().products.getAllDeletedProducts)();
}
function updateProduct(product) {
  return funcWrapper(dbWrapper().products.updateProduct)(product);
}
function deleteProduct(id) {
  return funcWrapper(dbWrapper().products.deleteProduct)(id);
}

// -----Types-------
function createType(type) {
  return funcWrapper(dbWrapper().types.createType)(type);
}
function getType(id) {
  return funcWrapper(dbWrapper().types.getType)(id);
}
function getAllTypes() {
  return funcWrapper(dbWrapper().types.getAllTypes)();
}
function updateType(type) {
  return funcWrapper(dbWrapper().types.updateType)(type);
}
function deleteType(id) {
  return funcWrapper(dbWrapper().types.deleteType)(id);
}

// -----Colors-------
function createColor(color) {
  return funcWrapper(dbWrapper().colors.createColor)(color);
}
function getColor(id) {
  return funcWrapper(dbWrapper().colors.getColor)(id);
}
function getAllColors() {
  return funcWrapper(dbWrapper().colors.getAllColors)();
}
function updateColor(color) {
  return funcWrapper(dbWrapper().colors.updateColor)(color);
}
function deleteColor(id) {
  return funcWrapper(dbWrapper().colors.deleteColor)(id);
}

// -----Orders-------
function createOrder(product) {
  return funcWrapper(dbWrapper().orders.createOrder)(product);
}
function getOrder(orderNumber) {
  return funcWrapper(dbWrapper().orders.getOrder)(orderNumber);
}
function getAllOrders() {
  return funcWrapper(dbWrapper().orders.getAllOrders)();
}
function updateOrderStatus(order) {
  return funcWrapper(dbWrapper().orders.updateOrderStatus)(order);
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

  admins: {
    createAdmins,
    getAdminRefreshToken,
    updateAdminRefreshToken,
  },

  products: {
    createProduct,
    getProduct,
    getAllProducts,
    getProductIdAndQuantity,
    getAllDeletedProducts,
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

  orders: {
    createOrder,
    getOrder,
    getAllOrders,
    updateOrderStatus,
  },
};
