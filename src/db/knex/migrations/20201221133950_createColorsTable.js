exports.up = async knex => {
  await knex.schema.createTable('colors', table => {
    table.increments('id');
    table.string('color').notNullable();
    table.unique('color');
    table.timestamps();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('colors');
};
