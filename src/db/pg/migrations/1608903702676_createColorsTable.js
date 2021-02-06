/* eslint-disable camelcase */

exports.up = async pgm => {
  pgm.createTable('colors', {
    id: 'id',
    color: { type: 'VARCHAR(255)', notNull: true, unique: true },
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
  });
};

exports.down = async pgm => {
  pgm.dropTable('colors');
};
