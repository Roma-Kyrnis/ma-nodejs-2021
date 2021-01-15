const {
  tables: { ADMINS },
} = require('../../config');

let pgClient;

async function createAdmins(admins) {
  const columnNames = [];
  const query = [];
  const values = [];

  const timestamp = new Date();

  for (const [index, admin] of Object.entries(admins)) {
    const queryValues = [];

    const setValues = (key, value) => {
      if (index === '0') columnNames.push(key);
      queryValues.push(`$${values.length + 1}`);
      values.push(value);
    };

    for (const [key, value] of Object.entries(admin)) setValues(key, value);
    setValues('created_at', timestamp);
    setValues('updated_at', timestamp);

    query.push(`(${queryValues.join(',')})`);
  }

  await pgClient.query(
    `INSERT INTO ${ADMINS}(${columnNames})
        VALUES ${query.join(',')}
      ON CONFLICT (name)
        DO UPDATE
          SET updated_at = excluded.updated_at
      RETURNING *`,
    values,
  );
  return true;
}

async function getAdminRefreshToken({ name }) {
  const res = await pgClient.query(
    `SELECT "refresh-token"
      FROM ${ADMINS}
    WHERE name = $1`,
    [name],
  );

  return res.rows[0];
}

async function updateAdminRefreshToken({ hash, name, refreshToken }) {
  await pgClient.query(
    `UPDATE ${ADMINS}
      SET "refresh-token" = $1,
          updated_at = $2
    WHERE ${hash ? 'hash' : 'name'} = $3`,
    [refreshToken, new Date(), hash || name],
  );

  return true;
}

module.exports = client => {
  pgClient = client;

  return {
    createAdmins,
    getAdminRefreshToken,
    updateAdminRefreshToken,
  };
};
