/* eslint-disable camelcase */

exports.up = async pgm => {
  pgm.createTable('admins', {
    id: { type: 'SERIAL', primaryKey: true },
    hash: { type: 'VARCHAR(255)', notNull: true },
    name: { type: 'VARCHAR(255)', notNull: true, unique: true },
    'refresh-token': { type: 'VARCHAR(255)', notNull: false, default: null },
    created_at: 'created_at',
    updated_at: 'updated_at',
  });
};

exports.down = async pgm => {
  pgm.dropTable('admins');
};
