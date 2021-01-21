/* eslint-disable camelcase */

exports.up = async pgm => {
  pgm.createTable('products', {
    id: 'id',
    typeId: { type: 'INT', notNull: true, references: 'types', unique: true },
    colorId: { type: 'INT', notNull: true, references: 'colors', unique: true },
    price: { type: 'NUMERIC(10,2)', default: 0.0, unique: true },
    quantity: { type: 'BIGINT', notNull: true, default: 1 },
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
  });
};

exports.down = async pgm => {
  pgm.dropTable('products');
};
