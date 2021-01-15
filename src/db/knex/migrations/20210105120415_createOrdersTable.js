exports.up = async knex => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable('orders', table => {
    table.specificType('id', 'INT GENERATED ALWAYS AS IDENTITY');
    table
      .uuid('orderNumber')
      .notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'))
      .primary();
    table.integer('productId').references('products.id').notNullable();
    table.integer('quantity').notNullable().defaultTo(1);
    table.string('status').notNullable();
    table.timestamps();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('orders');
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
};
