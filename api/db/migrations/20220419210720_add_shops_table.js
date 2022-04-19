/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
  return knex.schema
    .createTable('shops', function (table) {
      table.increments('id');
      table.timestamps(true, true);
      table.string('name', 100).notNullable();
      table.float('lat');
      table.float('lng');
      table.uuid('uuid').notNullable();
      table.integer('manager_id').unsigned().notNullable();

      table.foreign('manager_id').references('users.id')
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("shops");
};
