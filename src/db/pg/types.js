const {
  tables: { TYPES },
} = require('../../config');

const { throwIfInvalid } = require('../../utils');

let pgClient;

async function createType(type) {
  try {
    const timestamp = new Date();

    const res = await pgClient.query(
      `
      INSERT INTO ${TYPES}(type, created_at, updated_at, deleted_at)
        VALUES($1, $2, $3, $4)
      ON CONFLICT (type)
        DO UPDATE
          SET updated_at = excluded.updated_at
      RETURNING *
    `,
      [type, timestamp, timestamp, null],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getType(id) {
  try {
    console.log({ id });

    const res = await pgClient.query(
      `SELECT *
        FROM ${TYPES}
      WHERE id = $1 AND deleted_at IS NULL
    `,
      [id],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function getAllTypes() {
  try {
    const res = await pgClient.query(
      `SELECT * FROM ${TYPES} WHERE deleted_at IS NULL`,
    );

    return res.rows;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

async function updateType({ id, type }) {
  try {
    const res = await pgClient.query(
      `UPDATE ${TYPES}
        SET type = $1,
            updated_at = $2
        WHERE id = $3`,
      [type, new Date(), id],
    );

    return res.rows[0];
  } catch (err) {
    console.error(err.message || err);
    return throwIfInvalid(
      !err,
      400,
      'Cannot update, table already has this type',
    );
  }
}

async function deleteType(id) {
  try {
    await pgClient.query(
      `UPDATE ${TYPES}
        SET deleted_at = $1
        WHERE id = $2`,
      [new Date(), id],
    );
    return true;
  } catch (err) {
    console.error(err.message || err);
    throw err;
  }
}

module.exports = client => {
  pgClient = client;

  return {
    createType,
    getType,
    getAllTypes,
    updateType,
    deleteType,
  };
};
