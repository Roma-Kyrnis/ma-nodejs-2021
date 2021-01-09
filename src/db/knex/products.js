const {
  tables: { PRODUCTS, TYPES, COLORS },
} = require('../../config');

const { throwIfInvalid } = require('../../utils');

let knex;

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  const timestamp = new Date();

  const [typeId] = await knex(TYPES).where({ type }).select('id');
  throwIfInvalid(typeId, 400, `No such type defined in the table ${TYPES}`);

  const [colorId] = await knex(COLORS).where({ color }).select('id');
  throwIfInvalid(colorId, 400, `No such color defined in the table ${COLORS}`);

  const [product] = await knex(PRODUCTS)
    .insert({
      typeId: typeId.id,
      colorId: colorId.id,
      price,
      quantity,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .returning('*')
    .onConflict(['typeId', 'colorId', 'price'])
    .merge({ quantity: knex.raw(`${PRODUCTS}.quantity + ${quantity}`) })
    .returning('*');

  return product;
}

async function getProduct(id) {
  return await knex(PRODUCTS)
    .where(`${PRODUCTS}.id`, id)
    .andWhere(`${PRODUCTS}.deleted_at`, null)
    .join(TYPES, `${PRODUCTS}.typeId`, '=', `${TYPES}.id`)
    .join(COLORS, `${PRODUCTS}.colorId`, '=', `${COLORS}.id`)
    .select(
      `${TYPES}.type`,
      `${COLORS}.color`,
      `${PRODUCTS}.price`,
      `${PRODUCTS}.quantity`,
    )
    .first();
}

async function getAllProducts() {
  return await knex(PRODUCTS)
    .where(`${PRODUCTS}.deleted_at`, null)
    .join(TYPES, `${PRODUCTS}.typeId`, '=', `${TYPES}.id`)
    .join(COLORS, `${PRODUCTS}.colorId`, '=', `${COLORS}.id`)
    .select(
      `${PRODUCTS}.id`,
      `${TYPES}.type`,
      `${COLORS}.color`,
      `${PRODUCTS}.price`,
      `${PRODUCTS}.quantity`,
    );
}

async function getAllDeletedProducts() {
  return await knex(PRODUCTS)
    .whereNot(`${PRODUCTS}.deleted_at`, null)
    .join(TYPES, `${PRODUCTS}.typeId`, '=', `${TYPES}.id`)
    .join(COLORS, `${PRODUCTS}.colorId`, '=', `${COLORS}.id`)
    .select(
      `${PRODUCTS}.id`,
      `${TYPES}.type`,
      `${COLORS}.color`,
      `${PRODUCTS}.price`,
      `${PRODUCTS}.quantity`,
      `${PRODUCTS}.deleted_at`,
    );
}

async function updateProduct({ id, ...product }) {
  const getObjectId = async (timestamp, { name, value }) => {
    const tableName = name === 'type' ? TYPES : COLORS;
    const [objectId] = await knex(tableName)
      .insert({
        [name]: value,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .returning('id')
      .onConflict(name)
      .merge()
      .returning('id');
    return objectId;
  };

  const query = {};
  const timestamp = new Date();

  for await (const [key, value] of Object.entries(product)) {
    switch (key) {
      case 'type':
        query.typeId = await getObjectId(timestamp, { name: key, value });
        break;

      case 'color':
        query.colorId = await getObjectId(timestamp, { name: key, value });
        break;

      default:
        query[key] = value;
        break;
    }
  }

  throwIfInvalid(Object.keys(query).length, 400, 'Nothing to update');

  query.updated_at = timestamp;

  try {
    const [result] = await knex(PRODUCTS)
      .where({ id })
      .update(query)
      .returning('*');

    return result;
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(!err, 400, 'Table already has this product');
  }
}

async function deleteProduct(id) {
  await knex(PRODUCTS).where({ id }).update({ deleted_at: new Date() });

  return true;
}

module.exports = client => {
  knex = client;

  return {
    createProduct,
    getProduct,
    getAllProducts,
    getAllDeletedProducts,
    updateProduct,
    deleteProduct,
  };
};
