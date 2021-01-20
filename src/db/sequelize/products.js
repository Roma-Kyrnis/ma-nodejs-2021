const {
  Sequelize: { Op },
} = require('sequelize');

const {
  tables: { PRODUCTS, TYPES, COLORS },
} = require('../../config');
const { throwIfInvalid } = require('../../utils');

let sequelize;

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  const typeId = await sequelize[TYPES].findOne({
    where: {
      type,
      deletedAt: null,
    },
    returning: ['id'],
  });
  throwIfInvalid(typeId !== null, 400, `No such type in the table ${TYPES}`);

  const colorId = await sequelize[COLORS].findOne({
    where: {
      color,
      deletedAt: null,
    },
    returning: ['id'],
  });
  throwIfInvalid(colorId !== null, 400, `No such color in the table ${COLORS}`);

  const product = {
    typeId: typeId.id,
    colorId: colorId.id,
    price,
  };

  const res = await sequelize[PRODUCTS].findOrCreate({
    where: { ...product },
    defaults: { ...product, quantity },
  });

  if (!res[1]) {
    res[0].quantity += quantity;
    await res[0].save();
  }

  return res[0];
}

async function getProduct(id) {
  await sequelize[PRODUCTS].belongsTo(sequelize[TYPES]);
  await sequelize[PRODUCTS].belongsTo(sequelize[COLORS]);

  return await sequelize[PRODUCTS].findOne({
    where: { id, deletedAt: { [Op.is]: null } },
    include: [
      {
        model: sequelize[TYPES],
        required: true,
      },
      {
        model: sequelize[COLORS],
        required: true,
      },
    ],
  });
}

async function getAllProducts() {
  await sequelize[PRODUCTS].belongsTo(sequelize[TYPES]);
  await sequelize[PRODUCTS].belongsTo(sequelize[COLORS]);

  return await sequelize[PRODUCTS].findAll({
    where: { deletedAt: { [Op.is]: null } },
    include: [
      {
        model: sequelize[TYPES],
        required: true,
      },
      {
        model: sequelize[COLORS],
        required: true,
      },
    ],
  });
}

async function getAllDeletedProducts() {
  await sequelize[PRODUCTS].belongsTo(sequelize[TYPES]);
  await sequelize[PRODUCTS].belongsTo(sequelize[COLORS]);

  return await sequelize[PRODUCTS].findAll({
    where: { deletedAt: { [Op.ne]: null } },
    include: [
      {
        model: sequelize[TYPES],
        required: true,
      },
      {
        model: sequelize[COLORS],
        required: true,
      },
    ],
  });
}

async function updateProduct({ id, ...product }) {
  const getObjectId = async ({ name, value }) => {
    const tableName = name === 'type' ? TYPES : COLORS;
    const result = await sequelize[tableName].findCreateFind({
      where: { [name]: value },
    });
    return result[0].id;
  };

  const query = {};

  for await (const [key, value] of Object.entries(product)) {
    switch (key) {
      case 'type':
        query.typeId = await getObjectId({ name: key, value });
        break;

      case 'color':
        query.colorId = await getObjectId({ name: key, value });
        break;

      default:
        query[key] = value;
        break;
    }
  }

  throwIfInvalid(Object.keys(query).length, 400, 'Nothing to update');

  try {
    const res = await sequelize[PRODUCTS].update(query, {
      where: { id },
      returning: true,
    });

    return res[1][0];
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(!err, 400, 'Table already has this product');
  }
}

async function deleteProduct(id) {
  const res = await sequelize[PRODUCTS].update(
    { deletedAt: Date.now() },
    { where: { id, deletedAt: { [Op.is]: null } } },
  );

  throwIfInvalid(res[0], 400, 'Already deleted');

  return true;
}

module.exports = client => {
  sequelize = client;

  return {
    createProduct,
    getProduct,
    getAllProducts,
    getAllDeletedProducts,
    updateProduct,
    deleteProduct,
  };
};
