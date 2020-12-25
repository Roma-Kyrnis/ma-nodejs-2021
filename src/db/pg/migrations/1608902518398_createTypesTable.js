/* eslint-disable camelcase */

exports.shorthands = {
  id: { type: 'INT GENERATED ALWAYS AS IDENTITY', primaryKey: true },

  created_at: {
    type: 'timestamp',
    notNull: true,
  },

  updated_at: {
    type: 'timestamp',
    notNull: true,
  },

  deleted_at: {
    type: 'timestamp',
    notNull: false,
    default: null,
  },
};

exports.up = async pgm => {
  pgm.createTable('types', {
    id: 'id',
    type: { type: 'VARCHAR(255)', notNull: true },
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
  });
};

exports.down = async pgm => {
  pgm.dropTable('types');
};
