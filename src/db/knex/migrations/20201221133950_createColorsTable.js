exports.up = async knex => {
  await knex.schema.createTable('colors', table => {
    table.specificType('id', 'INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY');
    table.string('color').notNullable();
    table.unique('color');
    table.timestamps();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('colors');
};
