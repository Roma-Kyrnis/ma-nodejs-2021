exports.up = async knex => {
  await knex.schema.createTable('products', table => {
    table.specificType('id', 'INT GENERATED ALWAYS AS IDENTITY').primary();
    table.integer('typeId').references('id').inTable('types').notNullable();
    table.integer('colorId').references('id').inTable('colors').notNullable();
    table.decimal('price').nullable().defaultTo(0.0);
    table.unique(['typeId', 'colorId', 'price']);
    table.integer('quantity').notNullable().defaultTo(1);
    table.timestamp('deleted_at').nullable().defaultTo(null);
    table.timestamps();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('products');
};
