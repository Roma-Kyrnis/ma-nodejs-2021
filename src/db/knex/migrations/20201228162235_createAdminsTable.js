exports.up = async knex => {
  await knex.schema.createTable('admins', table => {
    table.increments('id');
    table.string('hash').notNullable();
    table.string('name').notNullable();
    table.uuid('refresh-token').nullable().defaultTo(null);
    table.unique('hash', 'name');
    table.timestamps();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('admins');
};
