/* eslint-disable camelcase */

exports.up = async pgm => {
  await pgm.createExtension('uuid-ossp', { ifNotExists: true });
  await pgm.createTable('orders', {
    id: { type: 'INT GENERATED ALWAYS AS IDENTITY', notNull: true },
    orderNumber: {
      type: 'UUID',
      notNull: false,
      default: pgm.func('uuid_generate_v4()'),
      primaryKey: true,
    },
    productId: { type: 'BIGINT', references: 'products', notNull: true },
    quantity: { type: 'BIGINT', notNull: true, default: 1 },
    status: { type: 'VARCHAR(255)', notNull: true },
    created_at: 'created_at',
    updated_at: 'updated_at',
  });
};

exports.down = async pgm => {
  await pgm.dropTable('orders');
  await pgm.dropExtension('uuid-ossp', { ifExists: true });
};
