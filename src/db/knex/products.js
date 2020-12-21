const {
  tables: { PRODUCTS, TYPES, COLORS },
} = require('../../config');

const { throwIfInvalid } = require('../../utils');

let knex;

async function createProduct({ type, color, price = 0, quantity = 1 }) {
  try {
    const timestamp = new Date();

    const [typeId] = await knex(TYPES).where({ type }).select('id');
    throwIfInvalid(
      typeId,
      400,
      'Cannot add this product, no such type defined in the table types',
    );

    const [colorId] = await knex(COLORS).where({ color }).select('id');
    throwIfInvalid(
      colorId,
      400,
      'Cannot add this product, no such color defined in the table colors',
    );

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
      .merge({ quantity: knex.raw(`products.quantity + ${quantity}`) })
      .returning('*');

    return product;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getProduct(id) {
  try {
    console.log(id);
    const [res] = await knex(PRODUCTS)
      .where(`${PRODUCTS}.id`, id)
      .andWhere({ deleted_at: null })
      .join(TYPES, `${PRODUCTS}.typeId`, '=', `${TYPES}.id`)
      .join(COLORS, `${PRODUCTS}.colorId`, '=', `${COLORS}.id`)
      .select(
        `${TYPES}.type`,
        `${COLORS}.color`,
        `${PRODUCTS}.price`,
        `${PRODUCTS}.quantity`,
      );

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllProducts() {
  try {
    const res = await knex(PRODUCTS)
      .where(`${PRODUCTS}.deleted_at`, null)
      .join(TYPES, `${PRODUCTS}.typeId`, '=', `${TYPES}.id`)
      .join(COLORS, `${PRODUCTS}.colorId`, '=', `${COLORS}.id`)
      .select(
        `${TYPES}.type`,
        `${COLORS}.color`,
        `${PRODUCTS}.price`,
        `${PRODUCTS}.quantity`,
      );

    return res;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateProduct({ id, ...product }) {
  const query = {};
  let queryLength = 0;

  const timestamp = new Date();

  for await (const [index, [key, value]] of Object.entries(product).entries()) {
    switch (key) {
      case 'type':
        [query.typeId] = await knex(TYPES)
          .insert({
            type: product.type,
            created_at: timestamp,
            updated_at: timestamp,
          })
          .returning('id')
          .onConflict('type')
          .merge()
          .returning('id');

        queryLength += 1;

        break;

      case 'color':
        [query.colorId] = await knex(COLORS)
          .insert({
            color: product.color,
            created_at: timestamp,
            updated_at: timestamp,
          })
          .returning('id')
          .onConflict('color')
          .merge()
          .returning('id');

        queryLength += 1;

        break;

      default:
        query[key] = value;
        queryLength += 1;

        break;
    }
  }

  throwIfInvalid(queryLength, 400, 'Nothing to update');

  query.updated_at = timestamp;

  try {
    const [res] = await knex(PRODUCTS)
      .where({ id })
      .update(query)
      .returning('*');

    return res;
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(
      !err,
      400,
      'Cannot update, table already has this product',
    );
  }
}

async function deleteProduct(id) {
  try {
    await knex(PRODUCTS).where({ id }).update({ deleted_at: new Date() });

    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = client => {
  knex = client;

  return {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
  };
};
