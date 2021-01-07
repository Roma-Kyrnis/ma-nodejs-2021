exports.up = async knex => {
  await knex.schema.createTable('types', table => {
    table.specificType('id', 'INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY');
    table.string('type').notNullable();
    table.unique('type');
    table.timestamps();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('types');
};
