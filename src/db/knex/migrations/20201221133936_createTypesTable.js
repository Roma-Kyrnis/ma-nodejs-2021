exports.up = async knex => {
  await knex.schema.createTable('types', table => {
    table.specificType('id', 'INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY');
    table.string('type').notNullable();
    table.unique('type');
    table.timestamps();
    table.timestamp('deleted_at').nullable().defaultTo(null);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('types');
};
