exports.up = async knex => {
  await knex.schema.createTable('admins', table => {
    table.increments('id');
    table.string('hash').notNullable();
    table.string('name').notNullable();
    table.string('refresh-token').nullable().defaultTo(null);
    table.unique('name');
    table.timestamp('deleted_at').nullable().defaultTo(null);
    table.timestamps();
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('admins');
};
